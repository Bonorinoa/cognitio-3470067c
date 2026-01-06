# Cognitio

**Un ecosistema académico exclusivo por invitación, centrado en el instructor.**

Cognitio no es un marketplace abierto. Es un "Instructor Studio" curado: LMS ligero + storefront + asistente de publicación con IA para instructores seleccionados.

---

## 🎯 Visión del Producto

### Filosofía Core

- **Exclusivo por invitación**: Los instructores son aprobados manualmente por Admins
- **Centrado en el instructor**: Maximizar autonomía y retención de ingresos
- **Simplicidad**: Arquitectura fácil de mantener para un equipo pequeño
- **Calidad sobre cantidad**: Contenido curado, no un marketplace saturado

### Personas de Usuario

| Persona                    | Descripción                                           | Necesidades Principales                                                                   |
| -------------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **Instructor Curado**      | Académicos, investigadores, consultores (40-70+ años) | Vender cursos, ofrecer consultoría, identidad digital simple, ayuda con IA para marketing |
| **Estudiante de por Vida** | Profesionales buscando expertise nicho                | Experiencia de lectura limpia, reproductor sin distracciones, seguimiento de progreso     |
| **Admin de Plataforma**    | Equipo interno pequeño                                | Gestión de roles, tareas de soporte                                                       |

### Tipos de Cursos

- **Públicos**: Visibles en catálogo, comprables vía Stripe
- **Privados**: Solo para cohortes específicas (ej: estudiantes universitarios), inscripción manual
- **Unlisted**: Accesibles solo por link directo

---

## 📍 Estado Actual: v4.0.1

**Última Actualización:** Enero 5, 2026

### ✅ Funcionalidades Completas

#### Core Platform (v1.0 - v2.9.4)

- Autenticación de usuarios (registro/inicio de sesión/recuperación de contraseña)
- Sistema de roles (admin/instructor/student)
- Creación y edición de cursos con carga de video Mux
- Gestión de capítulos con ordenamiento y vista previa gratuita
- Integración de pagos con Stripe
- Navegación y filtrado de cursos (por categoría, búsqueda, ordenamiento, destacados)
- Dashboards de estudiantes e instructores
- Sistema de visibilidad de cursos (public/private/unlisted)
- Gestión de inscripciones para cursos privados/unlisted
- Perfiles públicos de instructor con bio, credenciales, redes sociales
- Analytics de instructor con métricas reales
- Servicios de consultoría de instructor
- **Sistema de Discusiones por Capítulo**: Preguntas, respuestas, upvoting/downvoting
- **AI Tutor Integrado**: Límite de 5 llamadas por capítulo por usuario (independiente del rol)
- **Recursos por Capítulo**: PDFs, enlaces externos, notebooks, videos adicionales
- Sistema de diseño con tema claro cálido
- Internacionalización completa (Español/Inglés)
- Security audit complete: 0 vulnerabilidades críticas

#### AI Studio - Public Content Platform (v4.0) ✅

- **Public Landing Page**: Hero, bundles showcase, how it works, pricing
- **Bundle-Based Architecture**: Marketing and Academic bundles with separate routes
- **Knowledge Base**: Global document management with types and context roles
- **Style Settings**: Simplified configuration (tone, audience, language, custom instructions)
- **Blog Generator**: Content generation with streaming, editing, and refinement
- **Rich Editor**: Preview/edit modes with ReactMarkdown
- **Content Refinement**: Inline editing with AI instructions
- **Generation History**: Save, load, and manage generations (FIFO 10 items)
- **Subscription System**: Stripe integration with Marketing ($19/mo), Academic ($19/mo), and Pro ($29/mo) bundles
- **Dynamic Tier Limits**: 
  - Free: 10 generations/day
  - Instructor perk: 50 generations/day
  - Marketing/Academic: 200 generations/day
  - Pro: 500 generations/day
- **Export Options**: Download content as Markdown or TXT
- **Mobile Navigation**: Responsive sidebar and tab navigation
- **Lovable AI Integration**: Gemini 2.5 Flash via AI Gateway

### 🚧 Próximo: v4.1+

- LinkedIn Post Generator (v4.1)
- X/Twitter Generator (v4.2)
- Newsletter Generator (v4.3)
- Academic Bundle Features (v5.0+)

Consulta **[DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md)** para el roadmap completo.
Consulta **[CHANGELOG.md](./CHANGELOG.md)** para el historial de cambios.

---

## 🚫 Non-Goals (Fuera de Alcance)

Cognitio **NO** es y **NO** construirá:

- LMS complejo (quizzes, gradebooks, SCORM)
- Funcionalidades enterprise (SAML SSO, integraciones HR)
- Foros de discusión pesados
- Calificación basada en IA
- Signup abierto de instructores

---

## 📚 Documentación

| Documento                                    | Contenido                                               |
| -------------------------------------------- | ------------------------------------------------------- |
| [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md) | Roadmap v1.x-v4.x, versiones completadas y planificadas |
| [TESTING.md](./TESTING.md)                   | Infraestructura y guías de testing unitario             |
| [E2E_TESTING.md](./E2E_TESTING.md)           | Guía completa de tests End-to-End con Playwright        |
| [CHANGELOG.md](./CHANGELOG.md)               | Historial de cambios y versiones                        |

---

## 🛠️ Stack Tecnológico

### Core (No Cambiar)

```
Frontend: React 18 + TypeScript + Vite + Tailwind CSS
UI: shadcn/ui + Radix UI + Framer Motion
Backend: Supabase (PostgreSQL + Auth + Edge Functions + Storage)
AI: Lovable AI Gateway (Gemini 2.5 Flash)
Video: Mux
Pagos: Stripe
Estado: TanStack Query
i18n: i18next
Testing: Vitest + React Testing Library + Playwright + MSW
```

### Bibliotecas Clave

- React Router DOM - Enrutamiento
- React Hook Form + Zod - Formularios y validación
- Recharts - Visualización de datos
- React Markdown - Renderizado de contenido generado por IA
- Lucide React - Iconos

---

## 🏁 Comenzar

### Prerrequisitos

- Node.js 18+ y npm
- Proyecto Supabase conectado (vía Lovable Cloud)

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Bonorinoa/cognitio.git
cd cognitio

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará en `http://localhost:5173`

### Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run lint         # Ejecutar ESLint
npm run preview      # Vista previa de producción
npx vitest run       # Ejecutar tests unitarios
npx playwright test  # Ejecutar tests E2E
```

---

## 🔐 Sistema de Roles

| Rol            | Capacidades                                                                                      |
| -------------- | ------------------------------------------------------------------------------------------------ |
| **Visitante**  | Ver landing de AI Studio, explorar bundles, ver cursos públicos                                  |
| **Student**    | Todo de Visitante + 10 gen IA/día, navegar cursos, comprar, ver videos, seguir progreso          |
| **Instructor** | Todo de Student + 50 gen IA/día, crear/editar cursos, ver analytics, gestionar capítulos         |
| **Admin**      | Todo de Instructor + asignar roles, ver todos los cursos, tareas de soporte                      |

**Importante:** Solo Admins pueden otorgar el rol de Instructor. No hay signup público de instructor.

---

## 🌐 Estructura de Rutas

### Públicas

| Ruta           | Descripción                  |
| -------------- | ---------------------------- |
| `/`            | Página de inicio             |
| `/auth`        | Autenticación                |
| `/courses`     | Catálogo de cursos           |
| `/course/:id`  | Detalle/reproductor de curso |
| `/instructors` | Catálogo de instructores     |
| `/services`    | Servicios de consultoría     |

### Estudiante (Autenticado)

| Ruta         | Descripción              |
| ------------ | ------------------------ |
| `/dashboard` | Dashboard del estudiante |
| `/settings`  | Configuración de cuenta  |

### Instructor (Rol requerido)

| Ruta                      | Descripción                   |
| ------------------------- | ----------------------------- |
| `/instructor`             | Dashboard del instructor      |
| `/instructor/courses`     | Lista de cursos propios       |
| `/instructor/create`      | Crear nuevo curso             |
| `/instructor/edit/:id`    | Editar curso                  |
| `/instructor/analytics`   | Analytics                     |
| `/instructor/settings`    | Configuración y perfil        |
| `/instructor/profile/:id` | Perfil público del instructor |

### AI Studio (Público)

| Ruta                              | Descripción                              |
| --------------------------------- | ---------------------------------------- |
| `/ai-studio`                      | Landing page pública con pricing         |
| `/ai-studio/knowledge`            | Base de Conocimiento (auth requerido)    |
| `/ai-studio/settings`             | Configuración de Estilo (auth requerido) |
| `/ai-studio/marketing`            | Hub del Paquete Marketing                |
| `/ai-studio/marketing/blog`       | Generador de Blogs                       |
| `/ai-studio/marketing/linkedin`   | LinkedIn (Próximamente)                  |
| `/ai-studio/marketing/twitter`    | X/Twitter (Próximamente)                 |
| `/ai-studio/marketing/newsletter` | Newsletter (Próximamente)                |
| `/ai-studio/academic`             | Hub del Paquete Académico (Próximamente) |

### Admin (Rol requerido)

| Ruta     | Descripción             |
| -------- | ----------------------- |
| `/admin` | Panel de administración |

---

## 📁 Estructura del Proyecto

```
cognitio/
├── src/
│   ├── components/        # Componentes reutilizables
│   │   ├── ui/            # shadcn/ui
│   │   ├── ai-studio/     # Componentes AI Studio
│   │   └── ...
│   ├── pages/             # Componentes de página
│   ├── contexts/          # React Context (Auth)
│   ├── hooks/             # Hooks personalizados
│   ├── integrations/      # Supabase client/types
│   ├── lib/               # Utilidades
│   ├── locales/           # Traducciones (es.json, en.json)
│   ├── test/              # Mocks y utilidades de test
│   ├── types/             # TypeScript types
│   └── assets/            # Assets estáticos
├── supabase/
│   ├── functions/         # Edge functions (Stripe, Mux, AI)
│   └── config.toml        # Configuración Supabase
├── e2e/                   # Tests E2E con Playwright
└── docs/                  # Documentación
```

---

## 🎨 Sistema de Diseño

### Identidad Visual

- **Estilo**: "Elegancia académica sin pretensiones"
- **Acento primario**: Coral/Salmon (hsl 14, 90%, 67%)
- **Fondos**: Blanco cálido y off-white
- **Texto**: Charcoal oscuro (hsl 0, 0%, 15%) para alto contraste
- **Tokens**: 100% HSL semánticos, sin colores directos

### Directrices

- Tipografía: `Roboto` o `Inter` para cuerpo, monospace para acentos
- Glassmorphism sutil en navbars, cards, modales
- Animaciones suaves con Framer Motion (sin parallax ni scroll-jacking)
- Mobile responsive con menú hamburguesa
- Blobs animados en hero background (respeta prefers-reduced-motion)
- Tarjetas estandarizadas: rounded-xl, hover:shadow-lg, hover:-translate-y-1

---

## 🧪 Testing

```bash
# Ejecutar tests unitarios
npx vitest run

# Modo watch
npx vitest

# Con cobertura
npx vitest run --coverage

# Tests E2E
npx playwright test

# E2E con UI interactiva
npx playwright test --ui
```

Para documentación detallada, consulta [TESTING.md](./TESTING.md) y [E2E_TESTING.md](./E2E_TESTING.md).

---

## 🌍 Despliegue

### Con Lovable

Abre [Lovable](https://lovable.dev) → Share → Publish

### Otras Plataformas

```bash
npm run build
# Subir contenido de dist/ a Vercel, Netlify, etc.
```

---

## 👨‍🏫 Fundadores

- **Gustavo González Bonorino** - Co-fundador e Instructor
- **Augusto González Bonorino** - Co-fundador e Instructor

_"Nos dedicamos a aprender enseñando"_

---

## 🤝 Contribuir

### Para AI Agents y Desarrolladores

1. **Leer primero**: DEVELOPMENT_PLAN.md para entender el roadmap
2. **Respetar el stack**: No introducir nuevas librerías sin justificación
3. **Seguir la visión**: Instructor-first, simplicidad, calidad sobre cantidad
4. **Testing**: Escribir/actualizar tests para cambios
5. **Terminología**: Usar "instructor" (no "teacher") en nuevo código

### Flujo de Desarrollo

1. Revisar DEVELOPMENT_PLAN.md para la versión actual
2. Crear rama de feature
3. Implementar cambios siguiendo las directrices
4. Ejecutar tests y linting
5. Enviar pull request

---

## 📄 Licencia

Parte del ecosistema Lovable. Ver términos de licencia de Lovable.

---

## 🆘 Soporte

1. Consultar documentación (DEVELOPMENT_PLAN.md, TESTING.md, etc.)
2. Revisar issues existentes
3. Abrir nuevo issue con información detallada

---

_Última actualización: Enero 2026 | Versión: 4.0.1_
