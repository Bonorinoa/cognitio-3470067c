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

| Persona | Descripción | Necesidades Principales |
|---------|-------------|------------------------|
| **Instructor Curado** | Académicos, investigadores, consultores (40-70+ años) | Vender cursos, ofrecer consultoría, identidad digital simple, ayuda con IA para marketing |
| **Estudiante de por Vida** | Profesionales buscando expertise nicho | Experiencia de lectura limpia, reproductor sin distracciones, seguimiento de progreso |
| **Admin de Plataforma** | Equipo interno pequeño | Gestión de roles, tareas de soporte |

### Tipos de Cursos
- **Públicos**: Visibles en catálogo, comprables vía Stripe
- **Privados**: Solo para cohortes específicas (ej: estudiantes universitarios), inscripción manual
- **Unlisted**: Accesibles solo por link directo

---

## 📍 Estado Actual: v1.0.0

**Última Actualización:** Diciembre 2024

### ✅ Funcionalidades Completas
- Autenticación de usuarios (registro/inicio de sesión)
- Sistema de roles (admin/instructor/student)
- Creación de cursos con carga de video Mux
- Gestión de capítulos con ordenamiento
- Integración de pagos con Stripe
- Navegación y filtrado de cursos
- Dashboards de estudiantes e instructores
- Carga de imágenes de cursos
- Seguimiento de progreso (marcar como completado)
- Página "Sobre Nosotros" con perfiles de instructores
- Animaciones con Framer Motion

### 🚧 En Desarrollo (Roadmap v1.1 - v2.0)
- v1.1: Refactor terminología (teacher → instructor)
- v1.3: Sistema de visibilidad de cursos (public/private/unlisted)
- v1.4: Panel de Administración
- v1.5: Perfiles públicos de instructor
- v1.6: Edición de cursos
- v2.0: AI Content Studio

Consulta **[DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md)** para el roadmap completo.

---

## 🚫 Non-Goals (Fuera de Alcance)

Cognitio **NO** es y **NO** construirá:
- LMS complejo (quizzes, gradebooks, SCORM)
- Funcionalidades enterprise (SAML SSO, integraciones HR)
- Foros de discusión pesados
- Calificación basada en IA
- Modelo de suscripción/bundles (solo pagos únicos)
- Signup abierto de instructores

---

## 📚 Documentación

| Documento | Contenido |
|-----------|-----------|
| [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md) | Roadmap v1.1-v2.0, decisiones pendientes, schema |
| [TECHNOLOGY_STACK.md](./TECHNOLOGY_STACK.md) | Stack tecnológico completo |
| [FEATURES.md](./FEATURES.md) | Documentación detallada de funcionalidades |
| [TESTING.md](./TESTING.md) | Infraestructura y guías de testing |

---

## 🛠️ Stack Tecnológico

### Core (No Cambiar)
```
Frontend: React 18 + TypeScript + Vite + Tailwind CSS
UI: shadcn/ui + Radix UI + Framer Motion
Backend: Supabase (PostgreSQL + Auth + Edge Functions + Storage)
Video: Mux
Pagos: Stripe
Estado: TanStack Query
i18n: i18next
Testing: Vitest + React Testing Library + MSW
```

### Bibliotecas Clave
- React Router DOM - Enrutamiento
- React Hook Form + Zod - Formularios y validación
- Recharts - Visualización de datos
- Lucide React - Iconos

Para detalles completos, consulta [TECHNOLOGY_STACK.md](./TECHNOLOGY_STACK.md).

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
npx vitest run       # Ejecutar tests
npx vitest           # Tests en modo watch
```

---

## 🔐 Sistema de Roles

| Rol | Capacidades |
|-----|-------------|
| **Student** | Navegar cursos, comprar, ver videos, seguir progreso |
| **Instructor** | Todo de Student + crear/editar cursos, ver analytics, gestionar capítulos |
| **Admin** | Todo de Instructor + asignar roles, ver todos los cursos, tareas de soporte |

**Importante:** Solo Admins pueden otorgar el rol de Instructor. No hay signup público de instructor.

---

## 🌐 Estructura de Rutas

### Públicas
| Ruta | Descripción |
|------|-------------|
| `/` | Página de inicio |
| `/auth` | Autenticación |
| `/courses` | Catálogo de cursos |
| `/course/:id` | Detalle/reproductor de curso |
| `/about` | Página Sobre Nosotros |

### Estudiante (Autenticado)
| Ruta | Descripción |
|------|-------------|
| `/dashboard` | Dashboard del estudiante |

### Instructor (Rol requerido)
| Ruta | Descripción |
|------|-------------|
| `/teacher` | Dashboard del instructor |
| `/teacher/courses` | Lista de cursos propios |
| `/teacher/create` | Crear nuevo curso |
| `/teacher/analytics` | Analytics |
| `/teacher/settings` | Configuración |

*Nota: Las rutas `/teacher/*` serán renombradas a `/instructor/*` en v1.1*

### Admin (Rol requerido) - Futuro v1.4
| Ruta | Descripción |
|------|-------------|
| `/admin` | Panel de administración |

---

## 📁 Estructura del Proyecto

```
cognitio/
├── src/
│   ├── components/        # Componentes reutilizables
│   │   ├── ui/            # shadcn/ui
│   │   └── ...
│   ├── pages/             # Componentes de página
│   ├── contexts/          # React Context (Auth)
│   ├── hooks/             # Hooks personalizados
│   ├── integrations/      # Supabase client/types
│   ├── lib/               # Utilidades
│   ├── locales/           # Traducciones (es.json)
│   ├── test/              # Mocks y utilidades de test
│   └── assets/            # Assets estáticos
├── supabase/
│   ├── functions/         # Edge functions (Stripe, Mux)
│   └── config.toml        # Configuración Supabase
└── docs/
    ├── DEVELOPMENT_PLAN.md
    ├── TECHNOLOGY_STACK.md
    ├── FEATURES.md
    └── TESTING.md
```

---

## 🎨 Sistema de Diseño

### Identidad Visual
- **Estilo**: "Elegancia académica sin pretensiones"
- **Acento primario**: Salmon (#FA8072)
- **Fondos**: Blanco y gris muy claro
- **Texto**: Gris muy oscuro/negro para alto contraste

### Directrices
- Tipografía: `Roboto` o `Inter` para cuerpo, monospace para acentos
- Glassmorphism sutil en navbars, cards, modales
- Animaciones suaves con Framer Motion (sin parallax ni scroll-jacking)
- Mobile responsive en todas las páginas

---

## 🧪 Testing

```bash
# Ejecutar todos los tests
npx vitest run

# Modo watch
npx vitest

# Con cobertura
npx vitest run --coverage
```

Para documentación detallada, consulta [TESTING.md](./TESTING.md).

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

*"Nos dedicamos a aprender enseñando"*

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

1. Consultar documentación (DEVELOPMENT_PLAN.md, FEATURES.md, etc.)
2. Revisar issues existentes
3. Abrir nuevo issue con información detallada

---

*Última actualización: Diciembre 2024 | Versión: 1.0.0*
