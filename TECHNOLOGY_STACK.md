# Stack Tecnológico

## Resumen

Cognitio es una plataforma educativa moderna construida con tecnologías web de vanguardia, proporcionando una arquitectura escalable y mantenible para aprendizaje en línea.

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
  - Configuración de tema personalizado
  - Compilador JIT (Just-In-Time)
- **shadcn/ui** - Componentes React de alta calidad y accesibles
  - Construido sobre primitivas Radix UI
  - Biblioteca de componentes personalizable
  - 40+ componentes pre-construidos incluyendo:
    - Dialogs, Dropdowns, Modals
    - Forms, Inputs, Selects
    - Componentes de navegación
    - Componentes de visualización de datos
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
  - Soporte multi-idioma
  - Español como idioma por defecto
- **react-i18next 16.x** - Bindings de React para i18next
  - Hooks para traducciones
  - Componentes de traducción

### Backend y Base de Datos
- **Supabase 2.89.0** - Alternativa open-source a Firebase
  - Base de datos PostgreSQL
  - Suscripciones en tiempo real
  - Row-level security
  - Autenticación integrada
  - Soporte para API RESTful y GraphQL

#### Esquema de Base de Datos
La plataforma usa las siguientes tablas principales:
- **profiles** - Información de perfil de usuario (rol, avatar, nombre completo)
- **courses** - Metadatos de cursos (título, descripción, precio, categoría)
- **chapters** - Estructura de contenido del curso (videos, orden, duración)
- **purchases** - Seguimiento de inscripciones en cursos
- **user_progress** - Seguimiento de completación de capítulos

### Gestión de Estado y Fetching de Datos
- **TanStack Query (React Query) 5.83.0** - Sincronización de datos potente
  - Gestión de estado del servidor
  - Caching y refetching automático
  - Actualizaciones optimistas
  - Deduplicación de peticiones

### Routing
- **React Router DOM 6.30.1** - Routing declarativo para React
  - Soporte de routing anidado
  - Matching de rutas dinámico
  - Guards de navegación
  - Manejo de parámetros URL

### Gestión de Formularios
- **React Hook Form 7.61.1** - Biblioteca de formularios performante
  - Re-renders mínimos
  - Validación integrada
  - Fácil integración con bibliotecas UI
- **Zod 3.25.76** - Validación de esquemas TypeScript-first
  - Type checking en runtime
  - Composición de esquemas
  - Personalización de mensajes de error
- **@hookform/resolvers 3.10.0** - Resolvers de validación para React Hook Form

### Visualización de Datos
- **Recharts 2.15.4** - Biblioteca de gráficos composable
  - Gráficos responsive
  - Múltiples tipos de gráficos
  - Estilos personalizables
  - Soporte de animaciones

### Manejo de Medios
- **Embla Carousel React 8.6.0** - Biblioteca de carrusel ligera
  - Soporte touch/swipe
  - Navegación por teclado
  - Transiciones personalizables

### Bibliotecas UI Adicionales
- **date-fns 3.6.0** - Biblioteca de utilidades de fecha JavaScript moderna
- **react-day-picker 8.10.1** - Componente de selector de fecha
- **cmdk 1.1.1** - Componente de menú de comandos (interfaz ⌘K)
- **sonner 1.7.4** - Sistema de notificaciones toast
- **vaul 0.9.9** - Componente drawer para móvil
- **input-otp 1.4.2** - Componente de input OTP
- **class-variance-authority 0.7.1** - Utilidad de estilos basados en variantes
- **clsx 2.1.1** - Utilidad para construir strings className
- **tailwind-merge 2.6.0** - Merge de clases Tailwind CSS

## Infraestructura de Testing

### Framework de Testing
- **Vitest 4.0.16** - Framework de unit testing rápido y nativo de Vite
  - Compatible con APIs de Jest
  - Ejecución ultrarrápida
  - Soporte nativo de ES modules
  - Code coverage integrado

### Utilidades de Testing
- **@testing-library/react 16.3.1** - Utilidades de testing React
  - Mejores prácticas de testing de componentes
  - Queries centradas en el usuario
  - Utilidades async
- **@testing-library/dom 10.4.1** - Utilidades de testing DOM
- **@testing-library/jest-dom 6.9.1** - Matchers Jest personalizados
- **@testing-library/user-event 14.6.1** - Simulación de interacción de usuario
- **jsdom 27.3.0** - Implementación JavaScript de estándares web
- **MSW (Mock Service Worker) 2.12.4** - Biblioteca de mocking de API
  - Intercepción de peticiones a nivel de red
  - Definiciones de mock reutilizables
  - Funciona en Node.js y navegadores

## Calidad de Código y Herramientas de Desarrollo

### Linting y Formateo
- **ESLint 9.32.0** - Linting JavaScript/TypeScript
  - Configuración personalizada
  - Reglas específicas de React
  - Integración con TypeScript
- **@typescript-eslint** - Parser y reglas ESLint para TypeScript
- **eslint-plugin-react-hooks 5.2.0** - Reglas de linting para React Hooks
- **eslint-plugin-react-refresh 0.4.20** - Linting para React Fast Refresh

### Procesamiento CSS
- **PostCSS 8.5.6** - Herramienta de transformación CSS
- **Autoprefixer 10.4.21** - Adición automática de prefijos de vendor
- **@tailwindcss/typography 0.5.16** - Defaults tipográficos bellos

### Configuración de Build
- **@vitejs/plugin-react-swc 3.11.0** - Plugin React usando SWC
  - Compilación más rápida que Babel
  - Optimizado para React Fast Refresh

## Flujo de Trabajo de Desarrollo

### Gestión de Paquetes
- **npm** - Gestor de paquetes principal
  - package-lock.json para builds reproducibles
- **bun.lockb** - Lockfile alternativo de Bun runtime (opcional)

### Scripts Disponibles
```bash
npm run dev        # Iniciar servidor de desarrollo
npm run build      # Build de producción
npm run build:dev  # Build de desarrollo
npm run lint       # Ejecutar ESLint
npm run preview    # Vista previa del build de producción
npx vitest run     # Ejecutar suite de tests
```

## Soporte de Navegadores
La aplicación apunta a navegadores modernos con soporte ES2020+:
- Chrome/Edge (últimas versiones)
- Firefox (últimas versiones)
- Safari (últimas versiones)
- Navegadores móviles (iOS Safari, Chrome Mobile)

## Optimizaciones de Rendimiento
- Code splitting vía imports dinámicos
- Tree shaking para tamaño de bundle mínimo
- Optimización de imágenes
- Lazy loading de rutas y componentes
- Características concurrentes de React
- Actualizaciones optimistas con React Query

## Características de Seguridad
- Row-level security en Supabase
- Protección de variables de entorno
- Flujo de autenticación seguro
- Protección CORS
- Prevención XSS a través del escape integrado de React

## Accesibilidad
- Cumplimiento WCAG 2.1 Level AA (vía Radix UI)
- Soporte de navegación por teclado
- Compatibilidad con lectores de pantalla
- Labels y roles ARIA
- Gestión de focus
- HTML semántico

## Despliegue
La aplicación está configurada para despliegue en:
- Plataforma Lovable (principal)
- Servicios de hosting estático (Vercel, Netlify, etc.)
- Distribución basada en CDN

## Configuración de Entorno
Variables de entorno requeridas:
- `VITE_SUPABASE_URL` - URL del proyecto Supabase
- `VITE_SUPABASE_ANON_KEY` - Clave anónima de Supabase

Ver archivo `.env` para detalles de configuración.
