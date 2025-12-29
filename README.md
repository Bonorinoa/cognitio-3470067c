# Cognitio - Plataforma de Cursos en Línea

Una plataforma educativa moderna que permite a instructores crear y vender cursos en línea, proporcionando a los estudiantes una experiencia de aprendizaje atractiva e interactiva.

## 🎯 Estado del Proyecto: MVP

**Versión Actual:** 1.0.0  
**Última Actualización:** Diciembre 2024

### Funcionalidades Completas
- ✅ Autenticación de usuarios (registro/inicio de sesión)
- ✅ Creación de cursos con carga de video Mux
- ✅ Reproducción de video en páginas de cursos
- ✅ Integración de pagos con Stripe
- ✅ Navegación y filtrado de cursos
- ✅ Dashboards de estudiantes e instructores
- ✅ Carga de imágenes de cursos
- ✅ Seguimiento de progreso (marcar como completado)
- ✅ Página "Sobre Nosotros" con perfiles de instructores
- ✅ Animaciones con Framer Motion

### En Progreso
- 🔄 Edición de cursos
- 🔄 Analytics del instructor con datos reales

Consulta **[DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md)** para el roadmap completo del MVP.

## 📚 Documentación

- **[DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md)** - Roadmap del MVP y estrategia de desarrollo
- **[TECHNOLOGY_STACK.md](./TECHNOLOGY_STACK.md)** - Stack tecnológico completo
- **[FEATURES.md](./FEATURES.md)** - Documentación detallada de funcionalidades
- **[TESTING.md](./TESTING.md)** - Infraestructura y guías de testing

## 🛠️ Stack Tecnológico

### Tecnologías Core
- **React 18.3.1** - Biblioteca de UI
- **TypeScript 5.8.3** - Desarrollo type-safe
- **Vite 5.4.19** - Herramienta de build y servidor de desarrollo
- **Tailwind CSS 3.4.17** - Framework CSS utility-first
- **shadcn/ui** - Componentes React de alta calidad

### Backend y Base de Datos
- **Supabase** - Base de datos PostgreSQL, autenticación y suscripciones en tiempo real
- **TanStack Query** - Gestión de estado del servidor y caché

### Bibliotecas Clave
- React Router DOM - Enrutamiento del lado del cliente
- React Hook Form + Zod - Manejo de formularios y validación
- Recharts - Visualización de datos
- Framer Motion - Animaciones fluidas
- i18next - Internacionalización (español por defecto)
- MSW - Mocking de API para tests
- Vitest - Framework de testing

Para el stack tecnológico completo, consulta [TECHNOLOGY_STACK.md](./TECHNOLOGY_STACK.md).

## 🏁 Comenzar

### Prerrequisitos
- Node.js 18+ y npm instalados ([instalar con nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- Cuenta y proyecto de Supabase (para servicios backend)

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/Bonorinoa/dark-bloom-learning.git
   cd dark-bloom-learning
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   
   Crear un archivo `.env` en el directorio raíz:
   ```env
   VITE_SUPABASE_URL=tu_url_de_proyecto_supabase
   VITE_SUPABASE_ANON_KEY=tu_clave_anonima_supabase
   ```

4. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   ```
   
   La aplicación estará disponible en `http://localhost:5173`

## 📜 Scripts Disponibles

```bash
npm run dev          # Iniciar servidor de desarrollo
npm run build        # Build para producción
npm run build:dev    # Build en modo desarrollo
npm run lint         # Ejecutar ESLint
npm run preview      # Vista previa del build de producción
npx vitest run       # Ejecutar suite de tests
npx vitest           # Ejecutar tests en modo watch
```

## 🧪 Testing

El proyecto usa Vitest con React Testing Library para testing comprehensivo.

### Ejecutar Tests
```bash
# Ejecutar todos los tests
npx vitest run

# Ejecutar tests en modo watch
npx vitest

# Ejecutar tests con cobertura
npx vitest run --coverage
```

Para documentación detallada de testing, consulta [TESTING.md](./TESTING.md).

## 📁 Estructura del Proyecto

```
cognitio/
├── src/
│   ├── components/        # Componentes de UI reutilizables
│   │   ├── ui/            # Componentes shadcn/ui
│   │   ├── StickyInstructorCard.tsx  # Tarjetas de instructor con efecto sticky
│   │   └── ...
│   ├── pages/             # Componentes de página (rutas)
│   │   ├── AboutPage.tsx  # Página Sobre Nosotros
│   │   └── ...
│   ├── contexts/          # Contextos de React (Auth)
│   ├── hooks/             # Hooks personalizados de React
│   ├── integrations/      # Integraciones con servicios externos
│   ├── lib/               # Funciones de utilidad
│   ├── locales/           # Archivos de traducción (es.json, en.json)
│   ├── test/              # Utilidades y mocks de test
│   └── assets/            # Assets estáticos
├── public/                # Archivos estáticos públicos
├── supabase/              # Configuración de Supabase
│   └── functions/         # Edge functions
├── TECHNOLOGY_STACK.md    # Documentación del stack tecnológico
├── FEATURES.md            # Documentación de funcionalidades
├── TESTING.md             # Documentación de testing
└── package.json           # Dependencias y scripts
```

## 🔐 Variables de Entorno

Variables de entorno requeridas:
- `VITE_SUPABASE_URL` - URL de tu proyecto Supabase
- `VITE_SUPABASE_ANON_KEY` - Clave anónima de Supabase

Variables opcionales para procesamiento de pagos:
- Claves de Stripe (configuradas en Supabase)

## 🌐 Rutas de la Aplicación

| Ruta | Descripción |
|------|-------------|
| `/` | Página de inicio |
| `/auth` | Página de autenticación |
| `/dashboard` | Dashboard del estudiante |
| `/courses` | Catálogo de cursos |
| `/course/:id` | Detalle/reproductor de curso |
| `/about` | Página Sobre Nosotros |
| `/teacher` | Dashboard del instructor |
| `/teacher/courses` | Lista de cursos del instructor |
| `/teacher/create` | Crear nuevo curso |
| `/teacher/analytics` | Dashboard de analytics |
| `/teacher/settings` | Configuración del instructor |

## 🌍 Despliegue

### Desplegar con Lovable
Simplemente abre [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) y haz clic en Share → Publish.

### Desplegar en Otras Plataformas
La aplicación puede desplegarse en cualquier servicio de hosting estático:
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

Construir el bundle de producción:
```bash
npm run build
```

Los archivos construidos estarán en el directorio `dist/`.

## 👥 Roles de Usuario

### Estudiantes
- Navegar y buscar cursos
- Comprar e inscribirse en cursos
- Ver lecciones en video
- Seguir progreso de aprendizaje
- Ver dashboard personalizado

### Instructores
- Crear y publicar cursos
- Agregar capítulos y contenido de video
- Establecer precios
- Ver analytics e ingresos
- Seguir inscripciones de estudiantes

## 👨‍🏫 Fundadores

- **Gustavo González Bonorino** - Co-fundador e Instructor
- **Augusto González Bonorino** - Co-fundador e Instructor

*"Nos dedicamos a aprender enseñando"*

## 🤝 Contribuir

### Flujo de Desarrollo
1. Crear una rama de feature
2. Hacer tus cambios
3. Escribir/actualizar tests
4. Ejecutar tests y linting
5. Enviar un pull request

### Calidad de Código
- TypeScript para type safety
- ESLint para calidad de código
- Prettier para formato de código
- Vitest para testing

## 🔗 Enlaces

- **Demo en Vivo**: [Desplegar para ver demo en vivo]
- **Documentación**: Ver archivos de documentación para información detallada
- **Supabase**: [supabase.com](https://supabase.com)
- **Plataforma Lovable**: [lovable.dev](https://lovable.dev)

## 📄 Licencia

Este proyecto es parte del ecosistema Lovable y sigue sus términos de licencia.

## 🆘 Soporte

Para problemas y preguntas:
1. Consultar los archivos de documentación (TECHNOLOGY_STACK.md, FEATURES.md, TESTING.md)
2. Revisar issues existentes en GitHub
3. Abrir un nuevo issue con información detallada
