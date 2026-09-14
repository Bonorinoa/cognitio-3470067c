# Guía del piloto en aula real

Checklist operativa para dictar un curso real en Cognitio. Pensada para el admin
y los dos profesores del piloto (~20 estudiantes, ~20 horas de video en español).

---

## 1. Antes de arrancar

- [ ] Admin otorga el rol **instructor** a cada profesor desde `/admin`.
- [ ] Cada profesor completa su perfil (nombre, bio, afiliación) en `/instructor/configuracion`.
- [ ] Crear el curso con visibilidad **privada** y precio `0`.
- [ ] Cargar los estudiantes a mano desde la gestión de inscripciones del curso.

> **Sin cobros online**: todos los usuarios del piloto son privados, así que no hay
> procesamiento de pagos. Cuando se activen, el proveedor elegido es **Mercado Pago**
> (Stripe no opera en Argentina).

## 2. Subir una clase

1. Crear el capítulo y subir el video.
2. **Elegir el idioma del audio** en el selector (Español por defecto). Esto define
   el idioma de la transcripción automática: si se elige mal, el tutor lee texto sin sentido.
3. Esperar el procesamiento de Mux. La transcripción aparece en la pestaña
   *Transcripción* cuando termina (minutos, no segundos, en clases largas).
4. Verificar que la transcripción tenga sentido antes de avisarle a la clase.

> Si un video ya estaba subido antes del selector de idioma, su transcripción está en
> inglés. Hay que volver a subirlo eligiendo Español.

## 3. Material de cátedra

| Dónde | Qué acepta | Lo lee la IA |
| --- | --- | --- |
| Base de conocimiento (AI Studio) | PDF con texto, Word `.docx`, `.txt`, `.md`, `.csv` — hasta 15 MB | Sí |
| Recursos del capítulo | Cualquier archivo hasta 20 MB, y links | No |

PDF escaneados (foto de una página) no tienen texto seleccionable: exportá el original
o pegá el texto a mano. Presentaciones: exportalas a PDF.

## 4. Límites del tutor de IA

- 5 mensajes por capítulo **por día** por estudiante. Se reinicia a las 6 AM hora Argentina.
- Además hay un tope diario global por usuario y un tope por minuto según el tier.
- El tutor responde de forma socrática y cita timestamps `[M:SS]` clickeables.
- El admin puede apagar el tutor o cambiar el prompt/modelo desde `/admin/ai-tutor`.

## 5. Durante la cursada

- Seguimiento de uso de IA: `/admin/ai` (plataforma) y `/instructor/ai-insights` (por capítulo).
- Progreso de estudiantes: analytics del instructor.
- Si un estudiante reporta que "el tutor no entiende el video", revisar primero
  el idioma de la transcripción de ese capítulo.

## 6. Qué reportar

Anotar y pasar al equipo: capítulos donde el tutor falló, tiempos de procesamiento
de video que se sintieron largos, archivos que no se pudieron subir, y cualquier
pantalla en inglés o texto raro.
