# Aula real: preparar Cognitio para el piloto

Piloto: 20 estudiantes, 2 profesores, ~20 horas de video en español a lo largo de 3 meses.

Todo lo de abajo apunta a que ese piloto funcione de verdad. Nada de funcionalidades nuevas de producto.

---

## 1. Transcripción en español (bloqueante)

Hoy el sistema le pide a Mux subtítulos automáticos **en inglés**. Una clase en español sale como texto sin sentido, y ese texto es justamente lo que lee el tutor de IA.

- Pedir los subtítulos automáticos en español por defecto.
- Agregar un selector de idioma al subir el video (Español / Inglés), guardado por capítulo, por si en algún momento hay material en inglés.
- Verificar con una clase real en español de punta a punta: subida, transcripción lista, texto legible, click en un momento del texto que salta al video.

## 2. Clases largas: que el tutor vea la clase entera

Hoy, pasados unos 20 minutos de habla, el tutor solo recibe un resumen grueso más una ventana de dos minutos alrededor de donde está el estudiante. En clases de 75 minutos eso se nota mucho.

- Subir fuerte el límite de transcripción completa, aprovechando que Gemini 3 admite muchísimo más contexto del que estamos usando.
- Mantener el recorte por ventana solo como red de seguridad para clases muy largas, y cuando se active, elegir los fragmentos relevantes según lo que preguntó el estudiante en vez de solo la ventana temporal.
- Dejar registrado cuántas palabras de transcripción se enviaron, para medirlo en las métricas de uso.

## 3. Límites del tutor pensados para un cuatrimestre

- Hoy el tope es **5 mensajes por capítulo para siempre**. En un curso de 3 meses eso se agota en la primera semana. Pasarlo a 5 por capítulo **por día**.
- Sincronizar el modelo del tutor: la base todavía apunta a Gemini 2.5 mientras el resto de la plataforma usa Gemini 3.
- Revisar los topes por día y por minuto con 20 estudiantes activos al mismo tiempo y ajustarlos si quedan cortos.

## 4. Subir material en cualquier formato

Hoy la base de conocimiento solo acepta texto plano (.txt, .md, .csv). Un profesor va a querer subir un PDF o un Word.

- Aceptar PDF, Word y presentaciones, extrayendo el texto al subirlos.
- Mensajes claros cuando un archivo no se puede leer (por ejemplo, un PDF escaneado sin texto).
- Mantener el límite de tamaño y avisarlo antes de subir, no después.

## 5. Documentación honesta

- **README**: sacar la afirmación de soporte español/inglés (somos solo español), corregir el modelo de IA, actualizar fecha y estado real.
- **Checklist de lanzamiento**: sacar referencias a páginas retiradas, reflejar la estructura actual de planes/consultorías y el estado real de pagos y email.
- **Documento de IA**: alinear límites, modelos y manejo de transcripciones con lo que el código realmente hace.
- Agregar una **guía del piloto**: cómo se crea el curso privado, cómo se dan de alta los 20 estudiantes, qué puede y qué no puede hacer el tutor.

## 6. Limpieza y alta del aula

- Borrar los cursos de prueba que siguen en producción.
- Dejar listo el curso privado del piloto y verificar el alta manual de estudiantes (no hay pagos ni emails todavía, así que las altas son a mano).
- Confirmar que un estudiante inscripto ve el curso, el video, la transcripción, los recursos, las discusiones y el tutor; y que uno no inscripto no ve nada.

## 7. Prueba en vivo de todo

Recorrido completo con navegador automatizado, con capturas, sobre:

- Estudiante: catálogo, curso, reproductor, transcripción, recursos, discusión, tutor, progreso, valoración.
- Profesor: crear curso, subir video, esperar transcripción, cargar recursos, inscribir estudiantes, analíticas, AI Studio.
- Admin: usuarios y roles, controles del tutor, panel de uso de IA.
- Revisión de errores de consola y de red en cada paso.

Si querés sumar a Hermes para el recorrido, sirve sobre todo para la parte de contenido real (subir tus clases de verdad y evaluar la calidad de las respuestas del tutor); la parte funcional la cubro yo con el navegador automatizado.

---

## Capacidad: no es un problema

20 horas de video, 20 estudiantes y 2 profesores está muy por debajo de cualquier límite de la infraestructura. El riesgo del piloto es de **calidad** (transcripción en español, contexto de clases largas), no de escala.

---

## Detalles técnicos

- `mux-upload`: `generated_subtitles` pasa de `language_code: "en"` a `"es"`, parametrizado desde el cliente; `chapters` gana una columna de idioma de transcripción.
- `_shared/ai.ts` y `ai-discussion-reply`: subir `TRANSCRIPT_FULL_BUDGET`, selección de fragmentos por relevancia como fallback, registrar tokens de transcripción en `ai_usage_logs`.
- `ai_tutor_usage`: el conteo pasa a filtrarse por `created_at >= getDayStart()` junto con `chapter_id`.
- `platform_settings.ai_tutor_model` → `google/gemini-3-flash-preview`.
- `DocumentEditor`: extracción de texto de PDF/DOCX antes de guardar en `user_knowledge_base`.
- Borrado de cursos de prueba vía SQL de datos.
