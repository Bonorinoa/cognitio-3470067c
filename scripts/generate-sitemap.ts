// Generates public/sitemap.xml. Runs via predev/prebuild hooks.
import { writeFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://cognitio.lovable.app";
const SUPABASE_URL = "https://hlnvfkturjctxbiikfoe.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsbnZma3R1cmpjdHhiaWlrZm9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzMzc3MjIsImV4cCI6MjA4MTkxMzcyMn0.G5vlQIGb2FrLkIcJwTnvycUIyOqgcb9M9fK5KFXCwZo";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const staticEntries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/courses", changefreq: "daily", priority: "0.9" },
  { path: "/instructors", changefreq: "weekly", priority: "0.8" },
  { path: "/instructors/directory", changefreq: "weekly", priority: "0.7" },
  { path: "/planes", changefreq: "weekly", priority: "0.8" },
  { path: "/consultorias", changefreq: "weekly", priority: "0.6" },
  { path: "/instituciones", changefreq: "monthly", priority: "0.7" },
  { path: "/about", changefreq: "monthly", priority: "0.6" },
  { path: "/faq", changefreq: "monthly", priority: "0.5" },
  { path: "/ai-studio", changefreq: "weekly", priority: "0.6" },
  { path: "/auth", changefreq: "yearly", priority: "0.3" },
  { path: "/terms", changefreq: "yearly", priority: "0.2" },
  { path: "/privacy", changefreq: "yearly", priority: "0.2" },
];

async function fetchPublishedCourses(): Promise<SitemapEntry[]> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/courses?select=id,updated_at&visibility=eq.public&is_published=eq.true`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      },
    );
    if (!res.ok) {
      console.warn(`[sitemap] courses fetch failed: ${res.status}`);
      return [];
    }
    const rows = (await res.json()) as { id: string; updated_at: string }[];
    return rows.map((r) => ({
      path: `/course/${r.id}`,
      lastmod: r.updated_at?.slice(0, 10),
      changefreq: "weekly" as const,
      priority: "0.8",
    }));
  } catch (err) {
    console.warn(`[sitemap] courses fetch error:`, err);
    return [];
  }
}

function render(entries: SitemapEntry[]) {
  const urls = entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  );
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
    ``,
  ].join("\n");
}

const courseEntries = await fetchPublishedCourses();
const all = [...staticEntries, ...courseEntries];
writeFileSync(resolve("public/sitemap.xml"), render(all));
console.log(`sitemap.xml written (${all.length} entries, ${courseEntries.length} courses)`);
