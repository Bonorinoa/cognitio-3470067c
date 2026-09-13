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

- **Públicos**: Visibles en catálogo; el cobro online está pendiente (proveedor elegido: Mercado Pago)
- **Privados**: Solo para cohortes específicas (ej: estudiantes universitarios), inscripción manual

---

## 📍 Estado Actual: v4.2

**Última Actualización:** Septiembre 2026  
**Estado:** MVP en preparación para el primer piloto en aula real 🚀

> Uso real hasta hoy: ~5 usuarios, 6 cursos, 10 capítulos, 1 transcripción, 9 discusiones,
> 28 llamadas de IA. Nada fue ejercitado a volumen todavía.

### ✅ Funcionalidades Completas

#### Plataforma Core (v1.0 - v2.9.4)

- Autenticación de usuarios (registro/inicio de sesión/recuperación de contraseña)
- Sistema de roles (admin/instructor/student)
- Creación y edición de cursos con carga de video Mux
- Gestión de capítulos con ordenamiento y vista previa gratuita
- Integración de pagos con Stripe (código dormido: pagos diferidos; el proveedor elegido es Mercado Pago)
- Navegación y filtrado de cursos (categoría, búsqueda, ordenamiento, destacados, valoración)
- Dashboards de estudiantes e instructores
- Sistema de visibilidad de cursos (public/private)
- Gestión de inscripciones para cursos privados
- Perfiles públicos de instructor con bio, credenciales, redes sociales
- Analytics de instructor con métricas reales
- Servicios de consultoría de instructor
- Sistema de diseño con tema claro cálido
- Interfaz 100% en español rioplatense (scaffold i18n conservado; no hay contenido en inglés)
- Auditoría de seguridad completada: 0 vulnerabilidades críticas

#### Experiencia de Aprendizaje (v4.0.2 - v4.0.5) ✅

- **Sistema de Valoraciones**: Calificaciones 1-5 estrellas con reseñas, promedio visible en catálogo
- **Ordenar por Valoración**: Filtro "Mejor Valorados" en el catálogo de cursos
- **Discussion Threads**: Q&A por capítulo con upvoting, timestamps, @menciones
- **AI Tutor (CognitioAI)**: Mentoría socrática anclada a la transcripción, con citas de timestamp y límite de 5 mensajes por capítulo por día (reinicia 6 AM ART)
- **Pestaña Recursos**: PDFs, links, notebooks por capítulo con gestión de instructor
- **Pestaña Transcripción**: Transcripciones automáticas de video con click-to-seek
- **Reproductor de Video**: Mux-powered con navegación de capítulos y seguimiento de progreso

#### AI Studio - Plataforma de Contenido Pública (v4.0) ✅

- **Landing Page Pública**: Hero, showcase de bundles, cómo funciona, pricing
- **Arquitectura por Bundles**: Bundle Académico activo; el bundle Marketing quedó archivado (solo lista de espera)
- **Base de Conocimiento**: Gestión global de documentos con tipos y roles de contexto
- **Configuración de Estilo**: Configuración simplificada (tono, audiencia, idioma, instrucciones)
- **Generador de Blog**: Generación con streaming, edición y refinamiento
- **Editor Rico**: Modos preview/edit con ReactMarkdown
- **Refinamiento de Contenido**: Edición inline con instrucciones de IA
- **Historial de Generaciones**: Guardar, cargar y gestionar generaciones (FIFO 10 items)
- **Sistema de Suscripciones**: Integración Stripe con Academic ($19/mes) y Pro ($29/mes) — código dormido; los cobros se activarán con Mercado Pago.
- **Límites Dinámicos por Tier**: 
  - Free: 10 generaciones/día
  - Instructor perk: 50 generaciones/día
  - Academic: 200 generaciones/día
  - Pro: 500 generaciones/día
- **Opciones de Exportación**: Descargar contenido como Markdown o TXT
- **Navegación Móvil**: Sidebar y navegación responsiva
- **Integración Lovable AI**: Gemini 3 Flash vía AI Gateway, con medición de tokens, límites diarios y por minuto

### ⚠️ Limitaciones conocidas (honestas)

- **Transcripción**: el idioma se elige al subir el video (español por defecto). Videos
  subidos antes de este cambio se transcribieron en inglés y hay que regenerarlos.
- **Clases muy largas**: si la transcripción supera el presupuesto de contexto, el tutor
  recibe un esquema por bloques de 5 minutos + una ventana de ±2 min + los pasajes más
  relevantes a la pregunta. No es el 100% del texto.
- **Material de cátedra**: la base de conocimiento lee PDF (con texto), Word `.docx` y
  archivos de texto. PDF escaneados y presentaciones hay que convertirlos.
  Los recursos de capítulo se almacenan y se descargan, pero la IA **no** los lee.
- **Pagos**: sin procesamiento de pagos — todos los usuarios son privados y se inscriben a mano. Cuando se activen, el proveedor es **Mercado Pago** (Stripe no opera en Argentina); el código Stripe queda dormido.
- **Email**: no hay emails transaccionales ni invitaciones. Los formularios quedan en la base.
- **Escala probada**: ninguna. El piloto es la primera carga real.

### 🚧 Próximo

- Piloto en aula real (ver [`docs/piloto-aula.md`](./docs/piloto-aula.md))
- Funcionalidades del Bundle Académico

> Roadmap histórico y changelog v1–v4 archivados en [`docs/history/`](./docs/history/).
> A partir de v4.1 el roadmap se discute directamente con el agente de Lovable.

---

## 🚫 Non-Goals (Fuera de Alcance)

Cognitio **NO** es y **NO** construirá:

- LMS complejo (quizzes, gradebooks, SCORM)
- Funcionalidades enterprise (SAML SSO, integraciones HR)
- Calificación basada en IA
- Signup abierto de instructores

---

## 📚 Documentación

| Documento                                            | Contenido                                                   |
| ---------------------------------------------------- | ----------------------------------------------------------- |
| [CONTRIBUTING.md](./CONTRIBUTING.md)                 | Guía para admins no-técnicos (invitar instructor, refunds…) |
| [TESTING.md](./TESTING.md)                           | Infraestructura y guías de testing unitario                 |
| [E2E_TESTING.md](./E2E_TESTING.md)                   | Guía completa de tests End-to-End con Playwright            |
| [src/hooks/queries/README.md](./src/hooks/queries/README.md) | Patrón de acceso a datos (developers)                |
| [docs/history/](./docs/history/)                     | Roadmap y changelog histórico (archivado)                   |


---

## 🛠️ Stack Tecnológico

### Core (No Cambiar)

```
Frontend: React 18 + TypeScript + Vite + Tailwind CSS
UI: shadcn/ui + Radix UI + Framer Motion
Backend: Supabase (PostgreSQL + Auth + Edge Functions + Storage)
AI: Lovable AI Gateway (Gemini 3 Flash)
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
| `/instructor/guide`       | Guía del instructor           |
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
│   │   ├── discussion/    # Sistema de discusiones
│   │   ├── help/          # Componentes de ayuda/onboarding
│   │   └── sidebar/       # Componentes de sidebar
│   ├── pages/             # Componentes de página
│   ├── contexts/          # React Context (Auth)
│   ├── hooks/             # Hooks personalizados
│   ├── integrations/      # Supabase client/types
│   ├── lib/               # Utilidades
│   ├── locales/           # Traducciones (es.json — solo español)
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

_Última actualización: 7 de Enero 2026 | Versión: 4.0.5_
