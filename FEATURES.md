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
  - Acceso rápido a cursos inscritos
  - Funcionalidad de búsqueda de cursos
  - Filtro por estado (en progreso, completado)
  
- **Estadísticas de Aprendizaje**
  - Conteo de cursos inscritos
  - Conteo de cursos completados
  - Total de capítulos completados
  - Porcentaje de progreso general
  
- **Gestión de Cursos**
  - Ver todos los cursos inscritos
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
  - Drawer de navegación móvil
  - Reproducción de medios optimizada
  
- **UI Adaptativa**
  - Vistas para desktop, tablet y móvil
  - Layouts en grid responsive
  - Sidebars colapsables
  - Tipografía flexible

### 12. Soporte de Temas
- **Modo Oscuro/Claro**
  - Detección de preferencia del sistema
  - Toggle manual de tema
  - Selección de tema persistente
  - Transiciones de tema suaves

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
  - `*` - Página 404 Not Found
  
- **Componentes de Navegación**
  - Navbar global con estado de auth
  - Navegación sidebar del instructor
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

## Modelos de Datos

### Cursos
- Identificador único
- Título y descripción
- Clasificación por categoría
- Información de precio
- Asociación del instructor
- Estado de publicación
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
- Timestamps

## Características Técnicas

### Rendimiento
- Code splitting para tiempos de carga óptimos
- Lazy loading de rutas
- Optimización de imágenes
- Gestión de estado eficiente con React Query
- Estrategias de caching

### Animaciones
- Framer Motion para animaciones fluidas
- Animaciones de entrada en viewport
- Transiciones suaves entre estados
- Efecto de tarjetas apiladas con scroll

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

## Oportunidades de Mejora Futura

### Funcionalidades Potenciales
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

## Capacidades de la Plataforma

### Escalabilidad
- Base de datos alojada en la nube (Supabase)
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
