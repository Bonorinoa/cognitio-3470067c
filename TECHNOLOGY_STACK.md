# Stack Tecnológico

**Versión:** v3.9.0  
**Última Actualización:** Enero 2, 2026

## Resumen

Cognitio es una plataforma educativa moderna construida con tecnologías web de vanguardia, proporcionando una arquitectura escalable y mantenible para aprendizaje en línea con capacidades de generación de contenido con IA.

---

## Tecnologías Core

### Framework Frontend
- **React 18.3.1** - Biblioteca JavaScript moderna para construir interfaces de usuario
  - Arquitectura basada en hooks
  - Características de renderizado concurrente
  - Desarrollo basado en componentes

### Herramientas de Build y Desarrollo
- **Vite 5.4.19** - Herramienta de build frontend de próxima generación
  - HMR (Hot Module Replacement) ultrarrápido
  - Builds de producción optimizados
  - Desarrollo basado en ES modules
- **TypeScript 5.8.3** - Superset de JavaScript fuertemente tipado
  - Type safety en todo el codebase
  - Soporte mejorado de IDE y autocompletado
  - Mejor mantenibilidad del código

### Framework UI y Estilos
- **Tailwind CSS 3.4.17** - Framework CSS utility-first
  - Utilidades de diseño responsive
  - Configuración de tema personalizado con tokens HSL
  - Compilador JIT (Just-In-Time)
- **shadcn/ui** - Componentes React de alta calidad y accesibles
  - Construido sobre primitivas Radix UI
  - Biblioteca de componentes personalizable
  - 40+ componentes pre-construidos
- **Radix UI** - Primitivas de componentes no estilizados y accesibles
  - Cumple con WAI-ARIA
  - Soporte de navegación por teclado
  - Gestión de focus
- **Lucide React 0.462.0** - Biblioteca de iconos bella y consistente
- **next-themes 0.3.0** - Gestión de temas para modos dark/light

### Animaciones
- **Framer Motion 12.x** - Biblioteca de animaciones para React
  - Animaciones de entrada/salida suaves
  - Animaciones basadas en scroll
  - Gestos y transiciones

### Internacionalización
- **i18next 25.x** - Framework de internacionalización
  - Soporte multi-idioma (Español, Inglés)
  - Español como idioma por defecto
- **react-i18next 16.x** - Bindings de React para i18next
  - Hooks para traducciones
  - Componentes de traducción

---

## Backend y Base de Datos

### Supabase 2.89.0
Alternativa open-source a Firebase que proporciona:
- Base de datos PostgreSQL
- Suscripciones en tiempo real
- Row-level security (RLS)
- Autenticación integrada
- Soporte para API RESTful

### Esquema de Base de Datos

#### Tablas Core
| Tabla | Descripción |
|-------|-------------|
| `profiles` | Información de perfil de usuario (rol, avatar, nombre) |
| `courses` | Metadatos de cursos (título, descripción, precio, visibilidad) |
| `chapters` | Contenido del curso (videos Mux, orden, duración) |
| `purchases` | Registro de compras de cursos |
| `user_progress` | Seguimiento de completación de capítulos |
| `course_memberships` | Inscripciones a cursos privados/unlisted |
| `user_roles` | Roles de usuario (admin, instructor, student) |
| `instructor_services` | Servicios de consultoría |

#### Tablas AI Studio
| Tabla | Descripción |
|-------|-------------|
| `instructor_knowledge_base` | Documentos del instructor con roles de contexto |
| `instructor_style_profile` | Preferencias de estilo de escritura |
| `ai_generation_history` | Historial de generaciones con `is_active` para soft-delete |

### Edge Functions

7 Edge Functions activas:

| Función | Descripción |
|---------|-------------|
| `create-course-checkout` | Crea sesión de checkout en Stripe |
| `record-purchase` | Registra compra después de pago exitoso |
| `stripe-webhook` | Procesa eventos de webhook de Stripe |
| `mux-upload` | Genera URL de upload para videos Mux |
| `delete-account` | Elimina cuenta de usuario y datos asociados |
| `generate-content` | Generación de contenido con Lovable AI Gateway |
| `refine-content` | Refinamiento inline de texto seleccionado |

---

## Integración de IA

### Lovable AI Gateway
Integración sin necesidad de API keys propias:

- **Modelo**: Gemini 2.5 Flash (`google/gemini-2.5-flash`)
- **Uso**: Generación de blogs, refinamiento de contenido
- **Arquitectura**: Context Window Stuffing (100K tokens)
- **Streaming**: Respuestas en tiempo real con markdown

### Flujo de Generación
1. Documentos de Knowledge Base seleccionados por `context_role`
2. Style Profile aplicado al system prompt
3. Streaming de respuesta vía Edge Function
4. Tracking de uso en `ai_generation_history`

### Flujo de Refinamiento
1. Usuario selecciona texto en el editor
2. Envía instrucción de refinamiento
3. `refine-content` procesa con IA
4. Vista diff para aceptar/rechazar cambios

### Límites de Uso
- 10 generaciones por día por instructor
- Máximo 10 documentos por generación
- Budget de 100K tokens de contexto
- Historial FIFO: 10 items activos máximo (`is_active` column)

---

## Gestión de Estado y Fetching de Datos

- **TanStack Query (React Query) 5.83.0** - Sincronización de datos potente
  - Gestión de estado del servidor
  - Caching y refetching automático
  - Actualizaciones optimistas
  - Deduplicación de peticiones

### Hooks Personalizados

#### Core
- `useUserRole` - Gestión de roles de usuario
- `useInstructorAnalytics` - Métricas de instructor

#### AI Studio
- `useKnowledgeBase` - CRUD de documentos
- `useStyleProfile` - Gestión de perfil de estilo
- `useContentGeneration` - Generación con streaming
- `useGenerationUsage` - Tracking de uso diario (cuenta todos los de hoy)
- `useGenerationHistory` - CRUD historial con soft-delete (`is_active`)

---

## Routing

- **React Router DOM 6.30.1** - Routing declarativo para React
  - Soporte de routing anidado
  - Matching de rutas dinámico
  - Guards de navegación
  - Manejo de parámetros URL
  - Redirects legacy (`/teacher/*` → `/instructor/*`)

---

## Gestión de Formularios

- **React Hook Form 7.61.1** - Biblioteca de formularios performante
  - Re-renders mínimos
  - Validación integrada
  - Fácil integración con bibliotecas UI
- **Zod 3.25.76** - Validación de esquemas TypeScript-first
  - Type checking en runtime
  - Composición de esquemas
  - Personalización de mensajes de error
- **@hookform/resolvers 3.10.0** - Resolvers de validación para React Hook Form

---

## Integraciones Externas

### Stripe (Pagos)
- Checkout sessions para compras de cursos
- Webhooks para confirmación de pagos
- Manejo seguro de datos de pago

### Mux (Video)
- Upload directo de videos
- Streaming adaptativo
- Player personalizado con controles

---

## Visualización de Datos

- **Recharts 2.15.4** - Biblioteca de gráficos composable
  - Gráficos responsive
  - Múltiples tipos de gráficos
  - Usado en Analytics dashboard

---

## Infraestructura de Testing

### Framework de Testing
- **Vitest 4.0.16** - Framework de unit testing rápido y nativo de Vite
  - Compatible con APIs de Jest
  - Ejecución ultrarrápida
  - Soporte nativo de ES modules
  - Code coverage integrado

### Utilidades de Testing
- **@testing-library/react 16.3.1** - Utilidades de testing React
- **@testing-library/dom 10.4.1** - Utilidades de testing DOM
- **@testing-library/jest-dom 6.9.1** - Matchers Jest personalizados
- **@testing-library/user-event 14.6.1** - Simulación de interacción
- **jsdom 27.3.0** - Implementación JavaScript de estándares web
- **MSW (Mock Service Worker) 2.12.4** - Mocking de API a nivel de red

---

## Calidad de Código

### Linting y Formateo
- **ESLint 9.32.0** - Linting JavaScript/TypeScript
- **@typescript-eslint** - Parser y reglas ESLint para TypeScript
- **eslint-plugin-react-hooks 5.2.0** - Reglas para React Hooks
- **eslint-plugin-react-refresh 0.4.20** - Linting para Fast Refresh

### Procesamiento CSS
- **PostCSS 8.5.6** - Herramienta de transformación CSS
- **Autoprefixer 10.4.21** - Prefijos de vendor automáticos
- **@tailwindcss/typography 0.5.16** - Defaults tipográficos

---

## Flujo de Trabajo de Desarrollo

### Scripts Disponibles
```bash
npm run dev        # Servidor de desarrollo
npm run build      # Build de producción
npm run build:dev  # Build de desarrollo
npm run lint       # Ejecutar ESLint
npm run preview    # Vista previa de producción
npx vitest run     # Ejecutar suite de tests
```

### Gestión de Paquetes
- **npm** - Gestor de paquetes principal
- **package-lock.json** - Builds reproducibles

---

## Seguridad

- Row-level security (RLS) en todas las tablas
- Protección de variables de entorno (VITE_ prefix para cliente)
- Flujo de autenticación seguro con JWT
- Protección CORS
- Prevención XSS a través del escape de React
- CodeQL: 0 vulnerabilidades

---

## Rendimiento

- Code splitting vía imports dinámicos
- Tree shaking para tamaño de bundle mínimo
- Lazy loading de rutas y componentes
- Características concurrentes de React
- Actualizaciones optimistas con React Query

---

## Accesibilidad

- Cumplimiento WCAG 2.1 Level AA (vía Radix UI)
- Soporte de navegación por teclado
- Compatibilidad con lectores de pantalla
- Labels y roles ARIA
- Gestión de focus
- HTML semántico
- Respeto a `prefers-reduced-motion`

---

## Soporte de Navegadores

Navegadores modernos con soporte ES2020+:
- Chrome/Edge (últimas versiones)
- Firefox (últimas versiones)
- Safari (últimas versiones)
- Navegadores móviles (iOS Safari, Chrome Mobile)

---

## Configuración de Entorno

Variables de entorno requeridas:
- `VITE_SUPABASE_URL` - URL del proyecto Supabase
- `VITE_SUPABASE_ANON_KEY` - Clave anónima de Supabase
- `VITE_SUPABASE_PROJECT_ID` - ID del proyecto

Edge Functions (configuradas automáticamente):
- `STRIPE_SECRET_KEY` - Clave secreta de Stripe
- `STRIPE_WEBHOOK_SECRET` - Secreto del webhook de Stripe
- `MUX_TOKEN_ID` / `MUX_TOKEN_SECRET` - Credenciales de Mux
- `LOVABLE_API_KEY` - Gateway de IA (provisto automáticamente)

---

*Última actualización: Enero 2026 | Versión: 3.9.0*
