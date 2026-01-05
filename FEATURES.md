# Funcionalidades de la Plataforma

## Resumen

Cognitio es una plataforma educativa integral que permite a instructores crear y vender cursos mientras proporciona a los estudiantes una experiencia de aprendizaje interactiva y atractiva.

## Roles de Usuario

### Rol de Estudiante
Los estudiantes pueden navegar, comprar y completar cursos en la plataforma.

### Rol de Instructor
Los instructores pueden crear cursos, gestionar contenido y seguir el engagement y los ingresos de los estudiantes.

## Funcionalidades Core

### 1. Autenticación y Gestión de Usuarios
- **Autenticación Segura**
  - Autenticación email/contraseña vía Supabase Auth
  - Gestión de sesiones con refresh automático de tokens
  - Rutas protegidas que requieren autenticación
  - Control de acceso basado en roles (estudiante/instructor)
  
- **Perfiles de Usuario**
  - Información de perfil personalizable (nombre, avatar, email)
  - Asignación de roles (estudiante/instructor)
  - Persistencia de perfil entre sesiones

### 2. Página de Inicio (Index)
- **Sección Hero**
  - Propuesta de valor atractiva
  - Imagen de fondo llamativa
  - Botones de llamada a la acción para registro y navegación de cursos
  
- **Cursos Destacados**
  - Showcase de cursos principales
  - Tarjetas de curso con imágenes, precios y metadatos
  - Acceso rápido a detalles de cursos
  
- **Estadísticas de la Plataforma**
  - Visualización de métricas clave (estudiantes activos, cursos disponibles, tasa de completación)
  - Prueba social para construir confianza
  
- **Navegación**
  - Navbar responsive con logo "Cognitio"
  - Menú dinámico basado en estado de autenticación
  - Acceso rápido a inicio de sesión, navegación de cursos y dashboard de usuario
  - Enlaces: Inicio | Cursos | Sobre Nosotros

### 3. Navegación y Descubrimiento de Cursos
- **Catálogo de Cursos (CoursesPage)**
  - Vista en grid de todos los cursos disponibles
  - Filtrado por categoría
  - Funcionalidad de búsqueda
  - Opciones de ordenamiento
  
- **Tarjetas de Curso**
  - Imagen thumbnail del curso
  - Título y descripción
  - Visualización de precio
  - Badge de categoría
  - Conteo de capítulos
  - Información de duración
  - Indicador de progreso (para estudiantes inscritos)
  - Enlaces directos a detalles del curso

### 4. Detalles del Curso e Inscripción
- **Página de Curso**
  - Información detallada del curso
  - Curriculum del curso (lista de capítulos)
  - Información del instructor
  - Precio del curso
  - Verificación de estado de inscripción
  - Funcionalidad de compra/inscripción
  
- **Vista Previa de Capítulos**
  - Capítulos de vista previa gratuita para estudiantes potenciales
  - Visualización de duración de capítulos
  - Indicadores de bloqueado/desbloqueado
  - Ordenamiento secuencial de capítulos

### 5. Experiencia de Aprendizaje con Video
- **Reproductor de Video**
  - Reproductor Mux con controles personalizados
  - Funcionalidad de play/pausa
  - Barra de progreso con capacidad de seek
  - Control de volumen
  - Modo pantalla completa
  - Navegación de capítulos
  
- **Seguimiento de Progreso**
  - Botón "Marcar como Completado"
  - Seguimiento de completación por capítulo
  - Cálculo de porcentaje de progreso del curso
  - Persistencia de progreso entre sesiones
  - Indicadores visuales de progreso (checkmarks)

### 6. Dashboard del Estudiante
- **Dashboard Personalizado**
  - Mensaje de bienvenida con nombre del usuario
  - Acceso rápido a cursos inscritos (comprados Y por membresía)
  - Funcionalidad de búsqueda de cursos
  - Filtro por estado (en progreso, completado)
  - Internacionalización completa (Español)
  
- **Estadísticas de Aprendizaje**
  - Conteo de cursos inscritos
  - Conteo de cursos completados
  - Total de capítulos completados
  - Porcentaje de progreso general
  
- **Gestión de Cursos**
  - Ver todos los cursos (compras + membresías combinadas)
  - Continuar aprendizaje desde última posición
  - Seguir estado de completación
  - Acceder a materiales del curso

### 7. Dashboard del Instructor
- **Dashboard General**
  - Analytics de ingresos
  - Conteo total de estudiantes
  - Conteo de cursos activos
  - Feed de actividad reciente
  
- **Gestión de Cursos**
  - Lista de todos los cursos creados
  - Estado del curso (publicado/borrador)
  - Números de inscripción por curso
  - Ingresos por curso
  - Acciones rápidas (ver, editar, analytics)
  
- **Inscripciones Recientes**
  - Seguimiento de inscripciones en tiempo real
  - Información del estudiante
  - Fechas de inscripción
  - Asociación del curso

### 8. Creación y Gestión de Cursos
- **Crear Curso (CreateCourse)**
  - Wizard de creación de cursos multi-paso
  - Formulario de información del curso:
    - Título
    - Descripción
    - Selección de categoría
    - Configuración de precio
    - Carga de imagen del curso
  
- **Gestión de Capítulos**
  - Agregar múltiples capítulos
  - Establecer orden/posición de capítulos
  - Detalles del capítulo:
    - Título
    - Descripción
    - URL de video
    - Duración
    - Toggle de vista previa gratuita
  - Reordenamiento de capítulos
  - Eliminar capítulos
  
- **Controles de Publicación**
  - Guardar como borrador
  - Publicar curso
  - Despublicar curso
  - Editar cursos publicados

### 9. Integración de Pagos
- **Flujo de Compra de Cursos**
  - Proceso de checkout seguro
  - Integración con Stripe
  - Confirmación de compra
  - Inscripción automática después del pago
  - Seguimiento de historial de compras
  
- **Seguimiento de Ingresos**
  - Dashboard de ingresos totales
  - Ingresos por curso
  - Historial de pagos
  - Registros de compras de estudiantes

### 10. Progreso y Analytics
- **Progreso del Estudiante**
  - Seguimiento de completación por capítulo
  - Porcentaje de completación del curso
  - Timestamps de completación
  
- **Analytics del Instructor** (Dashboard)
  - Tendencias de inscripción de estudiantes
  - Métricas de rendimiento de cursos
  - Analytics de ingresos
  - Estadísticas de engagement

### 11. Diseño Responsive
- **Enfoque Mobile-First**
  - Layouts completamente responsive
  - Interfaces touch-friendly
  - Menú hamburguesa móvil en Navbar
  - Reproducción de medios optimizada
  
- **UI Adaptativa**
  - Vistas para desktop, tablet y móvil
  - Layouts en grid responsive
  - Sidebars colapsables
  - Tipografía flexible

### 12. Sistema de Diseño (v2.4-v2.9)
- **Tema Claro Cálido**
  - Acento primario: Coral/Salmon (hsl 14, 90%, 67%)
  - Fondos: Blanco y off-white cálidos
  - Texto: Charcoal oscuro para alto contraste
  - Tokens semánticos HSL en todo el codebase
  
- **Animaciones y Efectos**
  - Blobs animados en hero background (respeta prefers-reduced-motion)
  - Tarjetas estandarizadas con hover lift effect
  - Transiciones suaves en toda la UI
  - Framer Motion para animaciones de entrada

### 13. Notificaciones y Feedback
- **Notificaciones Toast**
  - Mensajes de éxito (inscripción, compras, progreso)
  - Manejo de errores con mensajes user-friendly
  - Estados de carga
  - Confirmaciones de acciones
  
- **Feedback Visual**
  - Skeletons de carga
  - Indicadores de progreso
  - Estados de botones (loading, disabled)
  - Mensajes de validación de formularios

### 14. Navegación y Rutas
- **Rutas de Páginas**
  - `/` - Página de inicio
  - `/auth` - Página de autenticación
  - `/forgot-password` - Recuperación de contraseña
  - `/reset-password` - Restablecer contraseña
  - `/dashboard` - Dashboard del estudiante
  - `/settings` - Configuración de usuario
  - `/courses` - Catálogo de cursos
  - `/course/:id` - Detalle/reproductor de curso
  - `/about` - Página Sobre Nosotros
  - `/instructors` - Catálogo de instructores
  - `/instructor` - Dashboard del instructor
  - `/instructor/courses` - Lista de cursos del instructor
  - `/instructor/create` - Crear nuevo curso
  - `/instructor/edit/:id` - Editar curso
  - `/instructor/analytics` - Dashboard de analytics
  - `/instructor/settings` - Configuración del instructor
  - `/instructor/profile/:id` - Perfil público del instructor
  - `/admin` - Panel de Administración
  - **AI Studio** (v4.0):
    - `/ai-studio` - Public landing page
    - `/ai-studio/knowledge` - Knowledge Base management (auth required)
    - `/ai-studio/settings` - Style configuration (auth required)
    - `/ai-studio/marketing` - Marketing bundle hub
    - `/ai-studio/marketing/blog` - Blog generator
    - `/ai-studio/marketing/linkedin` - LinkedIn (coming soon)
    - `/ai-studio/marketing/twitter` - Twitter (coming soon)
    - `/ai-studio/marketing/newsletter` - Newsletter (coming soon)
    - `/ai-studio/academic` - Academic bundle hub (coming soon)
  - `*` - Página 404 Not Found
  
- **Componentes de Navegación**
  - Navbar global con estado de auth (incluye AI Studio)
  - Navegación sidebar del instructor
  - AI Studio sidebar con navegación de bundles y features
  - Navegación breadcrumb
  - Botones de navegación hacia atrás

### 15. Página Sobre Nosotros (AboutPage)
- **Sección de Fundadores**
  - Efecto de tarjetas apiladas (sticky stack)
  - 8 tarjetas en total (4 por fundador)
  - Animaciones de entrada con Framer Motion
  - Layout responsive: 60% bio, 40% foto
  
- **Instructores Destacados**
  - Gustavo González Bonorino
  - Augusto González Bonorino
  
- **Diseño Visual**
  - Tarjetas con bordes redondeados
  - Sombras sutiles
  - Animaciones de scroll suaves
  - Efecto de apilamiento al hacer scroll

- **Lema**
  - "Nos dedicamos a aprender enseñando"

---

## 🤖 AI Studio - Public Content Platform (v4.0)

### Overview
AI Studio is a public AI-powered content generation platform that helps users create professional marketing and academic content from their knowledge base. Available to any authenticated user with tiered daily limits.

### Architecture

#### Bundle-Based Structure
- **Marketing Bundle**: Blog posts, LinkedIn posts, Twitter/X threads, newsletters
- **Academic Bundle**: Literature reviews, paper formatting, paper editing, citation generation

#### Routes
- `/ai-studio` - Public landing page (no auth required)
- `/ai-studio/knowledge` - Knowledge Base management (auth required)
- `/ai-studio/settings` - Style configuration (auth required)
- `/ai-studio/marketing` - Marketing bundle hub
- `/ai-studio/marketing/blog` - Blog generator (available)
- `/ai-studio/marketing/linkedin` - LinkedIn (coming soon)
- `/ai-studio/marketing/twitter` - Twitter (coming soon)
- `/ai-studio/marketing/newsletter` - Newsletter (coming soon)
- `/ai-studio/academic` - Academic bundle hub (coming soon)

### 16. AI Studio Landing (v4.0)
- **Public Access**
  - No authentication required to view
  - Hero section with value proposition
  - Bundles showcase (Marketing and Academic)
  - How It Works section
  - Pricing teaser (free tier promotion)
  
- **Call to Actions**
  - "Try Free - 10 generations/day" for non-authenticated users
  - Direct access to available features for authenticated users
  - "Coming Soon" badges for unreleased features

### 17. Knowledge Base (v3.5, Updated v4.0)
- **Gestión de Documentos**
  - CRUD completo para documentos de conocimiento
  - Tipos de documento: academic_paper, cv_bio, methodology, writing_sample, syllabus, other
  - Roles de contexto: style_reference, topic_source, background_context
  - Sistema de tags para organización
  - Conteo de tokens por documento
  - Toggle de estado activo/inactivo
  
- **Integración con Generación**
  - Documentos seleccionables como contexto para generación
  - Context window stuffing (hasta 100K tokens)
  - Priorización por context_role
  - Global access across all content types

### 18. Style Settings (v4.0 - Simplified)
- **Configuración Global de Estilo**
  - Tono: formal, conversational, academic, journalistic
  - Audiencia objetivo personalizable
  - Preferencia de idioma: español, inglés, bilingüe
  - Instrucciones custom adicionales
  
- **Simplificaciones desde v3.x**
  - Removed: Content length preferences (now dynamic per feature)
  - Removed: Content preferences (citations, examples, CTA)
  - Single settings page for all content types
  - Applies globally to all AI generations

### 19. Blog Generator (v3.5-v4.0)
- **Generación de Contenido**
  - Input de tema requerido
  - Instrucciones adicionales opcionales
  - Selección de documentos de contexto
  - Generación via Gemini 2.5 Flash (Lovable AI Gateway)
  - Streaming de contenido en tiempo real
  - Dynamic tier limit checking
  
- **Editor de Contenido Dual**
  - Modo Preview con ReactMarkdown
  - Modo Edit con textarea
  - Toggle entre modos
  - Tracking de cambios no guardados
  
- **Refinamiento con AI**
  - Selección de texto para refinar
  - Botón flotante "Refine with AI"
  - Acciones rápidas: Shorten, Expand, Simplify, Formalize
  - Instrucciones personalizadas
  - Vista diff para comparar original vs refinado
  - Aceptar/Rechazar cambios
  - Counts toward daily tier limit

- **Exportación**
  - Export a Plain Text (.txt)
  - Export a Markdown (.md)
  - Dropdown menu de opciones

### 20. Generation History (v3.8-v4.0)
- **Gestión de Historial**
  - FIFO queue de hasta 10 generaciones activas
  - Soft-delete con columna `is_active`
  - Guardar nuevas generaciones explícitamente
  - Actualizar generaciones existentes
  - Cargar desde historial al editor
  - Eliminar con confirmación
  
- **Tracking de Uso Diario (v4.0)**
  - Dynamic tier-based limits:
    - Free tier (any authenticated user): 10 generations/day
    - Instructor tier: 50 generations/day
    - Future subscription tiers ready in database
  - Conteo independiente del historial visible
  - Barra de progreso visual en sidebar
  - Queries optimizadas con índice compuesto
  - Counts ALL generations (generate + refine) today

### 21. Bundle Hubs (v4.0)
- **Marketing Bundle Hub**
  - Overview of available and coming soon features
  - Feature cards with status badges
  - Direct navigation to available features
  - "Notify Me" modal for coming soon features
  
- **Academic Bundle Hub**
  - Coming soon placeholder
  - Feature showcase for future academic tools
  - Literature review, paper formatter, paper editor, citation generator
  - "Notify Me" functionality for launch notifications

### 22. Coming Soon Features (v4.0)
- **Placeholder Pages**
  - Consistent design across all coming soon features
  - Feature description and benefits
  - "Notify Me" form for launch notifications
  - Breadcrumb navigation back to bundle hubs
  
- **Planned Features**
  - LinkedIn Post Generator (v4.1)
  - X/Twitter Generator with threads (v4.2)
  - Newsletter Generator (v4.3)
  - Academic bundle tools (v5.0+)

### Dynamic Tier System (v4.0)

#### Database Schema
- **ai_subscriptions table**
  - user_id, ai_bundle (enum), subscription_status (enum)
  - stripe_subscription_id, stripe_customer_id
  - current_period_start, current_period_end
  
- **ai_tier_limits table**
  - tier_name, daily_generations_limit
  - Supports: free, instructor, marketing_pro, academic_pro, ultimate_pro

#### Edge Functions
- **get-user-tier**: Determines user's current tier based on role and subscriptions
- **generate-content**: Checks tier limits before generation
- **refine-content**: Checks tier limits before refinement

#### Tier Limits
- **Free Tier**: Any authenticated user gets 10 generations/day
- **Instructor Tier**: Cognitio instructors get 50 generations/day
- **Future Pro Tiers**: Database ready for subscription-based limits

### Technical Implementation

#### AI Integration
- Lovable AI Gateway with Gemini 2.5 Flash
- Context window stuffing (no RAG/vector DB)
- 1M+ token context window support
- Strategic document placement by context_role

#### Usage Tracking
- Counts ALL generations today (ignores is_active for counting)
- Separate history management (FIFO 10 items with is_active)
- Optimized queries with composite indexes
- Real-time limit checking before generation

#### Public Access Strategy
- Landing page is public (no auth wall)
- Feature pages require authentication
- Tiered limits based on user role/subscription
- Seamless upgrade path to paid tiers (future)

---

## Modelos de Datos

### Cursos
- Identificador único
- Título y descripción
- Clasificación por categoría
- Información de precio
- Asociación del instructor
- Estado de publicación
- Visibilidad (public/private/unlisted)
- Timestamps
- URL de imagen/thumbnail
- IDs de integración Stripe

### Capítulos
- Identificador único
- Asociación del curso
- Título y descripción
- URL de video/playback ID de Mux
- Duración en segundos
- Posición de ordenamiento
- Flag de vista previa gratuita
- Timestamps

### Progreso del Usuario
- Asociación usuario y capítulo
- Estado de completación
- Timestamp de completación
- Porcentaje de progreso (calculado)

### Compras
- Asociación usuario y curso
- Monto de compra
- ID del proveedor de pago (Stripe)
- Timestamp de compra

### Perfiles
- Información del usuario
- Nombre completo y email
- URL de avatar
- Rol (estudiante/instructor)
- Credenciales y afiliación
- URLs de redes sociales
- Timestamps

### AI Studio - Database Schema (v4.0)

#### user_knowledge_base (renamed from instructor_knowledge_base)
- id, user_id (was instructor_id)
- title, content
- document_type (enum), context_role (enum)
- content_tokens, tags[], is_active
- created_at, updated_at

#### user_style_profile (renamed from instructor_style_profile)
- id, user_id (was instructor_id)
- tone (enum: formal, conversational, academic, journalistic)
- language_preference (enum: español, inglés, bilingüe)
- target_audience, custom_instructions
- setup_completed
- created_at, updated_at

#### ai_generation_history
- id, user_id, content_type
- topic, generated_content
- additional_instructions, selected_document_ids[]
- status (enum), error_message
- model_used, input_tokens, output_tokens, total_tokens
- is_active (para soft-delete y tracking)
- created_at, updated_at

#### ai_subscriptions (v4.0)
- id, user_id
- ai_bundle (enum: marketing, academic, both)
- subscription_status (enum: active, canceled, past_due, trialing)
- stripe_subscription_id, stripe_customer_id
- current_period_start, current_period_end
- created_at, updated_at

#### ai_tier_limits (v4.0)
- tier_name (primary key): free, instructor, marketing_pro, academic_pro, ultimate_pro
- daily_generations_limit
- created_at, updated_at

#### Enums (v4.0)
- ai_bundle: marketing, academic, both
- subscription_status: active, canceled, past_due, trialing

---

## Características Técnicas

### Rendimiento
- Code splitting para tiempos de carga óptimos
- Lazy loading de rutas
- Optimización de imágenes
- Gestión de estado eficiente con React Query
- Estrategias de caching
- Queries optimizadas con índices compuestos

### Animaciones
- Framer Motion para animaciones fluidas
- Animaciones de entrada en viewport
- Transiciones suaves entre estados
- Efecto de tarjetas apiladas con scroll
- Blobs animados en hero (keyframes CSS personalizados)
- Hover effects estandarizados en tarjetas (shadow-lg, translate-y)

### Seguridad
- Row-level security en base de datos
- Tokens de autenticación seguros
- Protección de variables de entorno
- Protección CORS
- Prevención XSS

### Accesibilidad
- Cumplimiento WCAG 2.1 AA
- Navegación por teclado
- Compatibilidad con lectores de pantalla
- Labels y roles ARIA
- Gestión de focus
- Estructura HTML semántica

### Manejo de Errores
- Estados de error elegantes
- Mensajes de error user-friendly
- Mecanismos de retry automático
- Componentes UI de fallback
- Página 404 para rutas inválidas

---

## 🎨 Design System (v2.4-v2.9.2)

### Color Palette
- **Warm Theme**: Coral/salmon primary colors with charcoal text
- **Semantic Tokens**: HSL-based color system for consistent theming
- **Accessibility**: High contrast ratios for readability

### Component Styling
- **Cards**: Standardized with `rounded-xl`, `hover:shadow-lg`, `hover:-translate-y-1`
- **Animations**: Framer Motion for smooth transitions (respects `prefers-reduced-motion`)
- **Typography**: Roboto (sans), Libre Caslon Text (serif), Roboto Mono (mono)

### Responsive Design
- Mobile-first approach with breakpoints at sm, md, lg, xl, 2xl
- Hamburger menu for mobile navigation
- Adaptive layouts for instructor dashboard and course pages
- Touch-friendly interaction areas

### Hero Background
- Animated blob gradients (10s ease-in-out infinite)
- Three overlapping blobs with staggered animations
- Respects accessibility preferences (prefers-reduced-motion)

### Featured Courses
- "Destacados" filter category in courses marketplace
- Star badge on featured course cards
- Featured flag in course database and API

---

## 🔒 Security (v2.9.1 Audit)

### Authentication & Authorization
- Supabase Auth with email/password
- JWT tokens with automatic refresh
- Role-based access control (admin/instructor/student)
- Protected routes with authentication guards

### Database Security
- Row Level Security (RLS) enabled on all tables
- Policies enforced at database level:
  - Users can only access their own data
  - Instructors can only modify their own courses
  - Public courses viewable by everyone
  - Admin-only operations properly secured

### Secrets Management
- Environment variables properly prefixed (VITE_ for client)
- Service keys only in edge functions (never in client code)
- .env files added to .gitignore
- No hardcoded credentials in source code

### Code Security
- CodeQL scanning: 0 vulnerabilities
- Input validation on all forms
- XSS protection through React's default escaping
- CSRF protection via Supabase Auth

---

## 📱 Known Issues & Limitations

### Test Suite
- 2 i18n-related test failures (non-blocking):
  - CourseCard test expects English text, component uses Spanish
  - InstructorDashboard test expects English text, component uses Spanish
- These are test localization issues, not functionality issues

### ESLint Warnings
- Some pre-existing `@typescript-eslint/no-explicit-any` warnings
- Some `react-refresh/only-export-components` warnings
- Not blocking production or functionality

### E2E Tests
- Require running development server
- Timeout in CI/CD without server running
- Manual testing confirms all features working

---

## Oportunidades de Mejora Futura

### Funcionalidades Potenciales
- **Newsletter Generator** - Generador de newsletters via AI Studio
- **Clases en Vivo** - Streaming de video en tiempo real
- **Tareas y Quizzes** - Evaluaciones interactivas
- **Certificados** - Certificados de completación de cursos
- **Foros de Discusión** - Comunicación estudiante-instructor
- **Reseñas de Cursos** - Sistema de calificación y reseñas
- **Listas de Deseos** - Guardar cursos para después
- **Cupones y Descuentos** - Precios promocionales
- **Compras Masivas** - Paquetes de entrenamiento corporativo
- **Apps Móviles** - Aplicaciones nativas iOS/Android
- **Content Drip** - Liberación programada de contenido
- **Transcripciones** - Transcripción y subtítulos de video
- **Recursos Descargables** - PDF, slides, archivos de código
- **Aprendizaje Social** - Grupos de estudio e interacción entre pares
- **Analytics Avanzados** - Métricas detalladas de engagement
- **Notificaciones por Email** - Actualizaciones y recordatorios de cursos
- **Soporte Multi-idioma** - Internacionalización completa

---

## Capacidades de la Plataforma

### Escalabilidad
- Base de datos alojada en la nube (Lovable Cloud)
- Assets estáticos distribuidos por CDN
- Listo para escalado horizontal
- Queries optimizadas con índices

### Mantenibilidad
- TypeScript para type safety
- Arquitectura basada en componentes
- Organización modular del código
- Cobertura de tests comprehensiva
- Verificaciones de calidad de código con ESLint

### Extensibilidad
- Potencial arquitectura basada en plugins
- Diseño API-first
- Componentes UI personalizables
- Sistema de estilos con temas
- Soporte de webhooks para integraciones

---

*Última actualización: Enero 2, 2026*
*Versión: v3.9.0*
