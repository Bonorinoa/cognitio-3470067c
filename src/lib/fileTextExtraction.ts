/**
 * Extract plain text from documents uploaded to the knowledge base.
 *
 * Supported: plain-text formats, PDF (text layer), and Word (.docx).
 * Scanned PDFs have no text layer — we detect that and say so instead of
 * silently saving an empty document.
 */

export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024; // 15 MB

const TEXT_EXTENSIONS = [
  ".txt", ".md", ".markdown", ".csv", ".tsv", ".json", ".xml",
  ".html", ".htm", ".rtf", ".py", ".js", ".ts", ".r", ".bib",
];

export const ACCEPTED_FILE_ACCEPT =
  ".pdf,.docx,.txt,.md,.markdown,.csv,.tsv,.json,.xml,.html,.htm,.rtf,.py,.js,.ts,.r,.bib";

export class UnsupportedFileError extends Error {}
export class EmptyDocumentError extends Error {}

function extensionOf(name: string): string {
  const i = name.lastIndexOf(".");
  return i === -1 ? "" : name.slice(i).toLowerCase();
}

async function extractPdf(file: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  const workerUrl = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

  const buffer = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: buffer }).promise;
  const pages: string[] = [];
  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const content = await page.getTextContent();
    const text = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    if (text) pages.push(text);
  }
  return pages.join("\n\n");
}

async function extractDocx(file: File): Promise<string> {
  // The browser build avoids pulling Node polyfills into the bundle.
  const mammoth = await import("mammoth/mammoth.browser");
  const buffer = await file.arrayBuffer();
  const result = await (mammoth as unknown as {
    extractRawText: (o: { arrayBuffer: ArrayBuffer }) => Promise<{ value: string }>;
  }).extractRawText({ arrayBuffer: buffer });
  return result.value.trim();
}

/**
 * Returns the document's text. Throws UnsupportedFileError for formats we
 * can't read and EmptyDocumentError when the file yields no usable text.
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const ext = extensionOf(file.name);

  let text: string;
  if (ext === ".pdf" || file.type === "application/pdf") {
    text = await extractPdf(file);
    if (!text.trim()) {
      throw new EmptyDocumentError(
        "Este PDF no tiene texto seleccionable (parece escaneado). Probá con un PDF generado desde el documento original, o pegá el texto a mano.",
      );
    }
  } else if (ext === ".docx") {
    text = await extractDocx(file);
    if (!text.trim()) {
      throw new EmptyDocumentError("El documento de Word está vacío o no tiene texto legible.");
    }
  } else if (ext === ".doc") {
    throw new UnsupportedFileError(
      "El formato .doc (Word viejo) no se puede leer. Guardalo como .docx o PDF y volvé a subirlo.",
    );
  } else if (ext === ".pptx" || ext === ".ppt" || ext === ".key") {
    throw new UnsupportedFileError(
      "Las presentaciones todavía no se pueden leer directamente. Exportalas a PDF y subí ese archivo.",
    );
  } else if (TEXT_EXTENSIONS.includes(ext) || file.type.startsWith("text/")) {
    text = await file.text();
    if (!text.trim()) throw new EmptyDocumentError("El archivo está vacío.");
  } else {
    throw new UnsupportedFileError(
      "Formato no soportado. Podés subir PDF, Word (.docx) o archivos de texto.",
    );
  }

  return text.trim();
}
