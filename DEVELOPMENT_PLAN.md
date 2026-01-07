# Plan de Desarrollo Cognitio

**Versión Actual:** v4.0.5  
**Última Actualización:** 7 de Enero, 2026  
**Estado:** MVP listo para testers iniciales 🚀

---

## Visión

Cognitio es un ecosistema académico exclusivo por invitación, centrado en el instructor. Prioriza la autonomía del instructor y la retención de ingresos sobre la escala del marketplace. Funcionalidades core: creación de cursos (public/private), pagos con Stripe, seguimiento de progreso, y AI Content Studio para asistencia de marketing.

**Stack Tecnológico:** React + Vite + TypeScript + Tailwind + shadcn/ui + Supabase + Stripe + Mux + Lovable AI  
**Roles:** Admin (gestión de plataforma) → Instructor (creación de contenido + herramientas IA) → Student (aprendizaje)

---

## Historial de Versiones

### v0.x–v1.x: Fundación y Funcionalidades Core

MVP inicial hasta plataforma completa de instructor con pagos, analytics y servicios.

| Versión | Enfoque | Entregables Clave | Estado |
|---------|---------|-------------------|--------|
| v1.0 | MVP | Auth, CRUD cursos, checkout Stripe, video Mux, seguimiento progreso | ✅ |
| v1.1 | Terminología | Refactor frontend: "teacher" → "instructor" | ✅ |
| v1.2 | Migración DB | Columna `instructor_id`, actualizaciones RLS, enum `app_role` | ✅ |
| v1.3 | Visibilidad | Enum `course_visibility` (public/private/unlisted), filtrado catálogo | ✅ |
| v1.4 | Panel Admin | UI gestión roles, tabla usuarios con asignación de roles | ✅ |
| v1.5 | Perfiles Instructor | Perfiles públicos, credenciales, links sociales, afiliación | ✅ |
| v1.6 | Edición Cursos | Editar cursos existentes, reordenar capítulos, reemplazo video | ✅ |
| v1.7 | Gestión Usuarios | Eliminación cuenta, cambio contraseña, configuración perfil | ✅ |
| v1.8 | Analytics | Dashboard instructor con ingresos, inscripciones, tasas completación | ✅ |
| v1.9 | Servicios | Tabla `instructor_services`, cards servicios, display público | ✅ |
| v1.9.1 | Pulido | Mejoras avatar upload, i18n para dashboard | ✅ |

---

### v2.x: Sistema de Diseño y Pulido UI

Rediseño completo UI/UX con paleta de colores cálidos, glassmorphism y animaciones.

| Versión | Enfoque | Entregables Clave | Estado |
|---------|---------|-------------------|--------|
| v2.0 | Tokens de Diseño | Sistema de colores HSL, variables CSS, config Tailwind | ✅ |
| v2.1 | Tipografía | Jerarquía de fuentes, estilos headings, optimización body text | ✅ |
| v2.2 | Librería Componentes | Variantes button, estilos card, inputs formulario | ✅ |
| v2.3 | Modo Oscuro | Toggle tema, paleta oscura, validación contraste | ✅ |
| v2.4 | Tema Cálido | Acento coral/salmon, fondos crema, sombras suaves | ✅ |
| v2.5 | Glassmorphism | Blur navbar, transparencia cards, overlays modal | ✅ |
| v2.6 | Sección Hero | Background con blobs animados, overlays gradiente | ✅ |
| v2.7 | Framer Motion | Transiciones página, efectos hover cards, animaciones scroll | ✅ |
| v2.8 | Sistema Cards | Estados hover estandarizados, espaciado consistente | ✅ |
| v2.9.0 | Responsive | Navegación móvil, menú hamburguesa, touch targets | ✅ |
| v2.9.1 | Bug Fixes | Alineación sidebar, performance animaciones, scroll behavior | ✅ |
| v2.9.2 | Membership | `CourseMembershipManager`, fix fetching cursos dashboard | ✅ |
| v2.9.3 | Cleanup | Eliminación código deprecado, consolidación documentación | ✅ |
| v2.9.4 | Testing | Fixes tests i18n, fixes ESLint prefer-const | ✅ |

---

### v3.x: AI Content Studio

Generación de contenido con IA para ayudar a instructores a crear materiales de marketing desde su expertise.

| Versión | Enfoque | Entregables Clave | Estado |
|---------|---------|-------------------|--------|
| v3.0 | Fundación | Schema DB, enums, types | ✅ |
| v3.1 | Base Conocimiento | CRUD documentos, hook `useKnowledgeBase` | ✅ |
| v3.2 | Perfiles Estilo | `StyleProfileForm`, preferencias tono/longitud/audiencia | ✅ |
| v3.3 | Generador Blog | Edge function `generate-content`, streaming markdown UI | ✅ |
| v3.4 | Tracking Uso | Hook `useGenerationUsage`, límites diarios, contador sidebar | ✅ |
| v3.5 | Mobile y Pulido | Navegación tab bar, visualización barra progreso | ✅ |
| v3.6 | Editor Rico | Toggle Preview/Edit, renderizado markdown | ✅ |
| v3.7 | Refinamiento | Edge function `refine-content`, selección texto inline, diff view | ✅ |
| v3.8 | Historial | Guardar/Actualizar/Eliminar generaciones, límite FIFO 10 items | ✅ |
| v3.9 | Dashboard | Landing page AI Studio Dashboard, soft-delete `is_active` | ✅ |
| v3.9.1 | Estabilización | Unificación toasts (Sonner), mejoras TypeScript | ✅ |

---

### v4.x: Comercialización AI Studio

Plataforma de contenido IA pública con monetización por suscripción.

| Versión | Enfoque | Entregables Clave | Estado |
|---------|---------|-------------------|--------|
| v4.0 | Comercialización | Landing pública, bundles, suscripciones Stripe, límites tier | ✅ |
| v4.0.1 | Cleanup | Alineación tiers, eliminación notificaciones, consolidación docs | ✅ |
| v4.0.2 | Sistema Discusiones | Threads por capítulo, upvoting, @menciones, timestamps | ✅ |
| v4.0.3 | AI Tutor | CognitioAI con límite 5 llamadas/día, respuestas context-aware | ✅ |
| v4.0.4 | Recursos y Transcripts | Recursos por capítulo, pestaña transcript, i18n completado | ✅ |
| v4.0.5 | Valoraciones y Cleanup | Sistema 1-5 estrellas, ordenar por valoración, cleanup codebase | ✅ |

---

## ✅ Completado

### v4.0.5 - 7 de Enero, 2026

**Checkpoint: MVP listo para testers iniciales**

- Sistema de valoraciones de cursos (1-5 estrellas con reseñas)
- Filtro "Mejor Valorados" en catálogo de cursos
- Política RLS para valoraciones (solo usuarios con acceso pueden valorar)
- Promedio y conteo de valoraciones visible en cards de cursos
- Migración imports edge functions a npm: specifiers (fix esm.sh 522)
- Documentación actualizada a español
- Eliminación código no utilizado (`emailValidation.ts`)
- Consolidación DEVELOPMENT_PLAN.md y CHANGELOG.md

### v4.0.4 - 6 de Enero, 2026

- Pestaña Transcripción en ChapterView con click-to-seek
- i18n español completado para ChapterResourceManager
- Documentación actualizada (README, TESTING, DEVELOPMENT_PLAN)
- Verificación sistema upvoting (triggers existentes)

### v4.0.3 - 6 de Enero, 2026

- CognitioAI tutor con trigger @mention
- Límite 5 llamadas/día por capítulo
- Respuestas conscientes del idioma (respeta i18n del usuario)
- Respuesta no-streaming para confiabilidad

### v4.0.2 - 6 de Enero, 2026

- Feature Discusiones con threads a nivel capítulo
- Sistema upvoting con triggers DB para sync conteo
- Video timestamp linking en preguntas
- Compositor respuestas con sugerencias @mention

### v4.0.1 - 5 de Enero, 2026

- PricingSection actualizado para coincidir con límites DB (200/200/500)
- Eliminadas todas las features de notificación (diferidas)
- Consolidación documentación (eliminados FEATURES.md, TECHNOLOGY_STACK.md, TEST_COVERAGE_SUMMARY.md)

### v4.0 - Comercialización AI Studio

#### Fase 1: Schema DB ✅
- Tablas instructor_* renombradas a user_*
- Creados enums ai_bundle y subscription_status
- Creadas tablas ai_subscriptions y ai_tier_limits

#### Fase 2: Actualizaciones Backend ✅
- generate-content con límites tier dinámicos
- refine-content con límites tier dinámicos
- Edge function get-user-tier
- Edge function create-ai-subscription

#### Fase 3: Navegación Pública ✅
- AI Studio en navbar principal
- Eliminado wrapper RequireInstructor de rutas
- Guards auth a nivel feature

#### Fase 4: Landing y Bundles ✅
- Landing page pública con pricing
- Routing basado en bundles
- Páginas hub para bundles Marketing y Académico
- Configuración estilo simplificada

---

## Roadmap: v4.1+ Próximos Pasos

### 🔜 Próximo

#### Fase 5: Features Bundle Marketing (v4.1-v4.3)
- [ ] Generador Posts LinkedIn (v4.1)
- [ ] Generador X/Twitter con soporte threads (v4.2)
- [ ] Generador Newsletter (v4.3)

#### Fase 6: Bundle Académico (v5.0+)
- [ ] Generador Literature Review
- [ ] Formateador Papers (estilos journal)
- [ ] Editor Papers
- [ ] Generador Citas

### Próximas Prioridades

| Enfoque | Entregables Planificados | Prioridad |
|---------|--------------------------|-----------|
| Features Marketing | Generadores LinkedIn, Twitter, Newsletter | 🔴 Alta |
| Cobertura Tests | Aumentar cobertura unit tests para hooks IA | 🟡 Media |
| Performance | Análisis Lighthouse, Core Web Vitals | 🟡 Media |

---

## Roadmap Futuro

### v5.0+: Features Avanzadas (Futuro)

| Enfoque | Features Planificadas |
|---------|----------------------|
| Analytics | Analytics estudiante avanzadas, tracking cohortes |
| AI Studio | Generación multi-idioma, generador outlines curso |
| Plataforma | Webhooks para integraciones, API pública |
| Inscripción | Links invitación cursos privados, inscripción CSV masiva |

---

## Non-Goals

Estas features están explícitamente fuera de alcance:

- Features LMS complejas (assignments, quizzes, gradebooks, SCORM)
- Features enterprise (SAML SSO, integraciones HR, jerarquías org)
- Calificación basada en IA o evaluación automática estudiantes
- Foros de discusión pesados o sistemas moderación
- Signup abierto de instructores (por diseño es solo invitación)
- RAG/búsqueda vectorial para IA (usando context window stuffing)

---

## Arquitectura AI Studio

### Estrategia Context Window
En lugar de RAG (Retrieval Augmented Generation), usamos "Context Window Stuffing":
- Gemini 2.5 Flash soporta 1M+ tokens
- Todos los documentos seleccionados caben en contexto único
- Arquitectura más simple, sin necesidad de base de datos vectorial
- Documentos etiquetados con `context_role` para placement estratégico en prompt

### Roles de Documento
| Rol | Propósito |
|-----|-----------|
| `style_reference` | Muestras de escritura para informar voz/tono |
| `topic_source` | Tema principal para generación |
| `background_context` | Expertise y credenciales |

### Límites de Uso por Tier
| Tier | Límite Diario | Rate Limit |
|------|---------------|------------|
| Free | 10 | 5/min |
| Instructor | 50 | 10/min |
| Marketing/Academic | 200 | 15/min |
| Pro | 500 | 20/min |

---

## Referencias

- **Cambios Detallados:** Ver [CHANGELOG.md](./CHANGELOG.md)
- **Guía Testing:** Ver [TESTING.md](./TESTING.md)
- **Testing E2E:** Ver [E2E_TESTING.md](./E2E_TESTING.md)
