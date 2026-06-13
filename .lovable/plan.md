## Instructor Onboarding Modal

A one-time, dismissible 3-step welcome that greets a newly approved instructor the first time they land in the instructor panel.

### Trigger
- Add `onboarding_completed_at` (timestamptz, nullable) to `profiles`.
- On `/instructor` mount, if the user has the `instructor` role AND `onboarding_completed_at IS NULL`, open the modal.
- Marking as complete (Finish, Skip, or closing on step 3) sets the timestamp.

### Steps (voseo, Spanish)

**1. Bienvenido a Cognitio**
   - Saludo personalizado ("¡Bienvenido, {nombre}!").
   - Resumen corto del recorrido (3 pasos, ~2 min).
   - CTA: "Empezar".

**2. Completá tu perfil**
   - Explica por qué importa (los alumnos eligen instructores con bio + foto).
   - Mini checklist en vivo (foto, bio, headline) leyendo `profiles`.
   - CTAs: "Ir al perfil" (lleva a `/instructor/profile`, deja el modal abierto para retomar) + "Siguiente".

**3. Tus herramientas**
   - Tres tarjetas: **Crear curso** (`/instructor/courses/new`), **AI Studio** (`/instructor/ai-studio`), **Guía** (`/instructor/guide`).
   - CTA principal: "Finalizar" → cierra y marca `onboarding_completed_at = now()`.

### UX details
- shadcn `Dialog`, no overlay dismiss on steps 1–2 (force the user to click Skip/Next), default close on step 3.
- "Saltar por ahora" link bottom-left en todos los pasos → marca completo.
- Progress dots arriba.
- Framer Motion fade/slide entre pasos (consistente con el resto del proyecto).
- Mobile-friendly (stack vertical en <640px).

### Files
- `supabase/migrations/*` — `ALTER TABLE profiles ADD COLUMN onboarding_completed_at timestamptz`.
- `src/components/instructor/InstructorOnboardingModal.tsx` — nuevo.
- `src/hooks/useInstructorOnboarding.ts` — fetch + mutate flag con TanStack Query.
- `src/pages/InstructorDashboard.tsx` — montar el modal.
- `src/locales/es.json` — strings nuevos bajo `instructor.onboarding.*`.

### Out of scope
- Tour interactivo sobre la UI (overlay/coachmarks).
- Recordatorios por email.
- Reabrir el modal desde Settings (lo dejamos para una próxima iteración si lo piden).
