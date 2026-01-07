# Changelog

Todos los cambios notables de Cognitio serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.0.5] - 2026-01-07

### 🚀 Checkpoint: MVP listo para testers iniciales

### Agregado
- **Sistema de Valoraciones**: Calificaciones 1-5 estrellas con reseñas para cursos
  - Promedio y conteo visible en `CourseCard` y `CourseOverview`
  - Iconos de estrella con color primario (coral) para consistencia visual
  - `CourseRatingCard` para que estudiantes envíen valoraciones
  - `CourseReviewsList` mostrando todas las reseñas del curso
  - Política RLS para asegurar que solo usuarios con acceso puedan valorar

- **Filtro Mejor Valorados**: Nueva opción "Mejor Valorados" en el catálogo de cursos
  - Ordena por promedio de valoración (mayor primero)
  - Usa conteo de valoraciones como desempate

### Cambiado
- **Edge Functions**: Migrados todos los imports de `esm.sh` a `npm:` specifiers
  - Resuelve errores HTTP 522 (timeout Cloudflare) con esm.sh
  - Afecta: ai-discussion-reply, create-ai-subscription, create-course-checkout, stripe-webhook, record-purchase, delete-account, download-resource, generate-content, get-user-tier, mux-upload, mux-webhook, refine-content

### Eliminado
- **Código no utilizado**: `src/lib/emailValidation.ts` (no estaba siendo importado)

### Documentación
- README.md completamente en español para testers hispanohablantes
- DEVELOPMENT_PLAN.md actualizado con estado v4.0.5
- CHANGELOG.md consolidado con historial completo

## [4.0.4] - 2026-01-06

### Agregado
- **Pestaña Transcripción**: Transcripciones automáticas de video en ChapterView
  - Click-to-seek: hacer click en texto salta al timestamp del video
  - Integración con reproductor Mux existente

### Cambiado
- i18n español completado para ChapterResourceManager
- Documentación actualizada (README, TESTING, DEVELOPMENT_PLAN)

### Verificado
- Sistema upvoting funciona correctamente (triggers ya existían)

## [4.0.3] - 2026-01-06

### Agregado
- **Course Landing Page**: Experiencia de vista de curso refactorizada en dos vistas
  - **Vista Overview** (default): Imagen hero, descripción, listado curriculum, sidebar pricing
  - **Vista Chapter**: Reproductor video, contenido específico capítulo, seguimiento progreso
  - Componentes `CourseOverview.tsx` y `ChapterView.tsx`
  - Navegación Previous/Next capítulo con controles keyboard-friendly
  - Botón "Volver al Overview" para navegación fácil
  - Descripciones de capítulo soportadas
  - Duración total del curso calculada y mostrada
  - Soporte i18n completo (EN/ES)

## [4.0.2] - 2026-01-06

### Cambiado
- **Visibilidad Curso Simplificada**: Eliminada opción "unlisted"
  - UI ahora solo muestra "Public" y "Private"
  - Cursos unlisted existentes migrados a private
  - Políticas RLS actualizadas
  - Lógica inscripción simplificada solo para cursos privados

### Corregido
- **Reconocimiento Tier Suscripción**: Status `trialing` ahora reconocido correctamente
  - Edge functions generate-content y refine-content actualizadas
  - Usuarios en trial ahora obtienen beneficios completos de su tier

### Agregado
- **Tests Tier Suscripción**: Tests automatizados para lógica resolución tier
  - Tests para manejo status active, trialing, canceled
  - Tests para alineación límites tier (Marketing: 200, Academic: 200, Pro: 500)
  - Tests para fallback rol instructor

## [4.0.1] - 2026-01-05

### Cambiado
- **Alineación Límites Tier**: PricingSection actualizado para coincidir con límites DB
  - Marketing/Academic: 200 generaciones/día (antes mostraba 100 incorrectamente)
  - Pro: 500 generaciones/día (antes mostraba "Unlimited" incorrectamente)

### Eliminado
- **Features Notificación Diferidas**: Eliminada toda funcionalidad "Notify Me"
  - Componente `NotifyMeModal.tsx` eliminado
  - Botones notificación eliminados de `MarketingBundleHub.tsx` y `AcademicBundleHub.tsx`
  - `ComingSoonFeature.tsx` simplificado (eliminado formulario email)
  - Features coming soon ahora muestran badge sin signup notificación

### Documentación
- **Consolidación Documentación**: Reducido footprint documentación
  - `FEATURES.md` eliminado (contenido fusionado en README y DEVELOPMENT_PLAN)
  - `TECHNOLOGY_STACK.md` eliminado (contenido en README)
  - `TEST_COVERAGE_SUMMARY.md` eliminado (contenido en TESTING.md)
  - README.md actualizado a v4.0.1 con límites tier actuales
  - DEVELOPMENT_PLAN.md actualizado con roadmap preciso

## [4.0.0] - 2026-01-05

### Agregado
- **Comercialización AI Studio**: Plataforma contenido IA pública completa
  - Landing page pública con hero, showcase bundles, y pricing
  - Arquitectura basada en bundles (Marketing y Academic)
  - Integración suscripciones Stripe para tiers pagos
  - Límites tier dinámicos: Free (10), Instructor (50), Marketing/Academic (200), Pro (500)
  - Edge function `create-ai-subscription` para Stripe Checkout
  - Edge function `get-user-tier` para resolución tier
  - UI gestión suscripciones en AIStudioSettings

### Cambiado
- **Schema DB**: Tablas instructor_* renombradas a user_* para acceso más amplio
- **Navegación**: AI Studio ahora visible en navbar principal para todos los visitantes
- **Flujo Auth**: Guards auth a nivel feature en lugar de protección a nivel ruta
- **Settings**: Configuración estilo simplificada (eliminadas preferencias longitud contenido)

## [3.9.1] - 2026-01-03

### Cambiado
- **Sistema Toast Unificado**: Todos los componentes migrados a Sonner, eliminado Toaster shadcn
  - VideoUpload.tsx migrado de useToast a Sonner
  - AIStudioBlog.tsx migrado de useToast a Sonner
  - Toaster shadcn eliminado de App.tsx

### Eliminado
- **Cleanup Código Muerto**:
  - Alias `isTeacher` deprecado eliminado de hook useUserRole
  - Asignación window `__aiStudioBlogHandlers` no utilizada eliminada
  
### Técnico
- **Mejoras TypeScript**: Utilidad `getErrorMessage` creada en `src/lib/errorUtils.ts`
  - 12 instancias de `catch (error: any)` reemplazadas con manejo error type-safe
  - Extracción mensaje error consistente en edge functions y hooks

## [3.9.0] - 2026-01-02

### Agregado
- **Dashboard AI Studio**: Nueva landing page en `/ai-studio` con:
  - Cards acción rápida para Blog Generator y Newsletter (coming soon)
  - Lista generaciones recientes con botones cargar
  - 4 cards analytics: Conteo Documentos, Status Estilo, Generaciones hoy, Total generaciones
  - Diseño responsive matching sistema diseño plataforma

- **Columna `is_active`**: Migración DB agregando capacidad soft-delete a `ai_generation_history`
  - Habilita tracking uso diario preciso independiente del límite display historial
  - Índice agregado para performance: `idx_ai_generation_history_active`

### Cambiado
- **`useGenerationHistory`**: Actualizado para usar soft-delete (set `is_active = false`) en lugar de hard-delete al alcanzar límite 10 items
- **`useGenerationUsage`**: Ahora cuenta TODAS las generaciones creadas hoy sin importar status `is_active`, asegurando tracking quota preciso
- **Sidebar AI Studio**: Dashboard agregado como primer item menú, detección link activo mejorada
- **Routing**: `/ai-studio` ahora muestra Dashboard, Base Conocimiento movida a `/ai-studio/knowledge`

### Corregido
- **Bug Contador Uso**: Antes mostraba conteo incorrecto cuando historial llegaba a límite 10 items; ahora trackea uso diario precisamente

## [3.8.0] - 2026-01-02

### Agregado
- **Historial Generaciones**: CRUD completo para generaciones guardadas
  - Botón Save to History para nuevas generaciones
  - Actualizar items historial existentes
  - Cargar items historial de vuelta al editor
  - Eliminar con diálogo confirmación
  - Cola FIFO (10 items máx)

- **Sidebar Historial**: Lista colapsable en sidebar AI Studio
  - Muestra generaciones recientes con timestamps relativos
  - Botones quick-load
  - Iconos eliminar con confirmación AlertDialog

### Técnico
- Política RLS para operación DELETE en `ai_generation_history`

## [3.7.0] - 2026-01-01

### Agregado
- **Refinamiento Inline**: Edición texto powered by IA
  - Edge function `refine-content` para refinamiento texto dirigido
  - Selección texto dispara botón flotante "Refine with AI"
  - Diálogo refinamiento con input instrucciones custom
  - Acciones rápidas: Shorten, Expand, Simplify, Formalize
  - Vista diff lado a lado para aceptar/rechazar cambios

- **Opciones Exportación**: Múltiples formatos exportación
  - Exportar como .txt (strip formato markdown)
  - Exportar como .md (preserva markdown)
  - Menú dropdown para selección formato

### Cambiado
- Editor ahora trackea `editableContent` separadamente para ediciones manuales
- Exportación usa contenido editado, no generación original

## [3.6.0] - 2026-01-01

### Agregado
- **Editor Rico**: Edición contenido dual-mode
  - Modo preview con renderizado ReactMarkdown
  - Modo edit con Textarea para edición markdown directa
  - Botón toggle para cambiar entre modos
  - Estado contenido editable para modificaciones manuales

### Técnico
- `react-markdown` integrado para renderizado contenido apropiado
- System prompt enforce reglas estrictas output "content-only"

## [3.5.0] - 2026-01-01

### Agregado
- **Visualización Barra Progreso**: Barra progreso visual para quota generación en sidebar AI Studio
  - Sidebar desktop muestra barra progreso debajo conteo generaciones
  - Header móvil incluye barra progreso compacta
  - Actualizaciones real-time mientras generaciones se usan

## [3.4.0] - 2026-01-01

### Agregado
- **Tracking Uso**: Límites generación diarios implementados para AI Studio
  - Hook `useGenerationUsage` para tracking uso diario
  - Límite 10 generaciones por día por instructor
  - Contador mostrado en sidebar AI Studio
  - Queries `ai_generation_history` para generaciones completadas hoy

## [3.3.0] - 2026-01-01

### Agregado
- **Generador Blog**: Workflow generación blog completo
  - Edge function `generate-content` usando Lovable AI Gateway
  - Integración modelo Gemini 2.5 Flash
  - Output markdown streaming
  - Hook `useContentGeneration` con soporte abort
  - Input topic con selección documentos
  - Preview contenido real-time

### Técnico
- Estrategia Context Window Stuffing (sin RAG necesario)
- Budget contexto 100K tokens
- Placement documento estratégico por `context_role`

## [3.2.0] - 2026-01-01

### Agregado
- **Perfiles Estilo**: Preferencias escritura instructor
  - Componente `StyleProfileForm` con UI colapsable
  - Hook `useStyleProfile` para operaciones CRUD
  - Preferencias: tono, longitud, idioma, audiencia
  - Soporte instrucciones custom
  - Tracking completación setup

### Database
- Tabla `instructor_style_profile` con todos los campos preferencia

## [3.1.0] - 2026-01-01

### Agregado
- **Base Conocimiento**: Gestión documentos para contexto IA
  - Componente `DocumentEditor` para crear/editar documentos
  - Hook `useKnowledgeBase` para operaciones CRUD
  - Tipos documento: academic_paper, cv_bio, methodology, writing_sample, syllabus, other
  - Roles contexto: style_reference, topic_source, background_context
  - Conteo tokens para tracking budget
  - Soporte tags para organización

### Database
- Tabla `instructor_knowledge_base` con schema completo

## [3.0.0] - 2026-01-01

### Agregado
- **Fundación AI Content Studio**
  - Componente `AIStudioLayout` con sidebar
  - `AIStudioSidebar` con navegación y display uso
  - Página `AIStudioKnowledge` para gestión base conocimiento
  - Página `AIStudioBlog` para generación blog
  - Tab bar móvil con `SlidingPillIndicator`
  - Rutas: `/ai-studio`, `/ai-studio/knowledge`, `/ai-studio/blog`
  - Link dropdown navbar a AI Studio

### Database
- Nuevas tablas: `instructor_knowledge_base`, `instructor_style_profile`, `ai_generation_history`
- Nuevos enums: `content_type`, `context_role`, `document_type`, `generation_status`, `language_preference`, `length_preference`, `writing_tone`

### Técnico
- Nueva edge function: `generate-content`
- Integración Lovable AI Gateway
- 4 nuevos custom hooks para funcionalidad IA

## [2.9.4] - 2025-12-31

### Corregido
- **Suite Tests**: Corregidos fallos tests relacionados con i18n
  - Mock i18n agregado a setup tests para traducciones inglés consistentes
  - Tests CourseCard actualizados para coincidir con strings español del componente
  - Todos los unit tests ahora pasan consistentemente

## [2.9.3] - 2025-12-30

### Corregido
- **Calidad Código**: Corregidos 4 errores ESLint `prefer-const`

## [2.9.2] - 2025-12-30

### Agregado
- **CourseMembershipManager**: Instructores ahora pueden inscribir estudiantes en cursos privados
- **Acceso Cursos Dashboard**: Dashboard estudiante ahora muestra cursos de AMBOS purchases Y memberships
- **i18n studentDashboard**: Traducción español completa para dashboard estudiante
- **Mejoras AvatarUpload**: Límite 10MB, compresión client-side, funcionalidad "Remove Photo"

### Deprecado
- **InstructorContactForm**: Eliminado en favor de links email directos en perfiles instructor

## [2.9.1] - 2025-12-30

### Corregido
- **InstructorSidebar**: Corregidos issues alineación y posicionamiento sticky
- **FoundersStorySection**: Corregidos bugs animación y scroll behavior
- **ProgressCard**: Efectos hover estandarizados

### Seguridad
- Archivos `.env` agregados a `.gitignore` como best practice
- Auditoría seguridad completada: 0 vulnerabilidades encontradas

## [2.9.0] - 2025-12-30

### Agregado
- Navegación móvil responsive con menú hamburguesa
- Sistema diseño con paleta colores coral/salmon cálida
- Hero background con blobs animados
- Animaciones Framer Motion en toda la UI
- Componentes card estandarizados con styling consistente

## [Versiones Anteriores]

Ver `DEVELOPMENT_PLAN.md` para detalles de releases v1.0 - v2.8.
