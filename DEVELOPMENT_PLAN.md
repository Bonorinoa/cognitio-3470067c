# Plan de Desarrollo MVP de Cognitio

## Resumen Ejecutivo

Cognitio es un sistema de gestión de cursos que permite a instructores crear y vender cursos de video mientras proporciona a los estudiantes una experiencia de aprendizaje atractiva. Este documento describe la estrategia para alcanzar una versión MVP completa.

---

## Evaluación del Estado Actual

### ✅ Funcionalidades Completadas

| Categoría | Funcionalidad | Estado |
|----------|---------|--------|
| **Autenticación** | Auth email/contraseña vía Supabase | ✅ Completo |
| | Acceso basado en roles (estudiante/instructor) | ✅ Completo |
| | Rutas protegidas | ✅ Completo |
| **Gestión de Cursos** | Creación de cursos (título, descripción, precio, categoría) | ✅ Completo |
| | Gestión de capítulos con ordenamiento | ✅ Completo |
| | Flujo de borrador/publicación | ✅ Completo |
| | Carga de imágenes de cursos | ✅ Completo |
| **Integración de Video** | Carga de video Mux | ✅ Completo |
| | Reproducción de video Mux | ✅ Completo |
| | Seguimiento de duración de video | ✅ Completo |
| **Pagos** | Integración de checkout Stripe | ✅ Completo |
| | Registro de compras | ✅ Completo |
| | Acceso a curso después de compra | ✅ Completo |
| **Experiencia del Estudiante** | Navegación de cursos con filtros | ✅ Completo |
| | Inscripción a cursos | ✅ Completo |
| | Dashboard del estudiante | ✅ Completo |
| | Seguimiento de progreso | ✅ Completo |
| **Experiencia del Instructor** | Dashboard del instructor | ✅ Completo |
| | Sidebar de gestión de cursos | ✅ Completo |
| **UI/UX** | Página Sobre Nosotros con tarjetas apiladas | ✅ Completo |
| | Animaciones con Framer Motion | ✅ Completo |
| | Navbar rebrandeado a "Cognitio" | ✅ Completo |

### ⚠️ Parcialmente Completo

| Funcionalidad | Estado Actual | Trabajo Restante |
|---------|---------------|----------------|
| Analytics del instructor | UI básica existe | Conectar a datos reales |

### ✅ Completado Recientemente (Diciembre 2024)

| Funcionalidad | Estado | Notas |
|---------|--------|-------|
| Carga de imagen de curso | ✅ Completo | Carga a storage Supabase con validación |
| Lógica de acceso a capítulos | ✅ Completo | Instructores pueden acceder a sus propios cursos |
| Seguimiento de progreso | ✅ Completo | Botón marcar como completado y persistencia |
| Limpieza de UI | ✅ Completo | Removido botón "Watch Demo" sin usar |
| Página Sobre Nosotros | ✅ Completo | Tarjetas apiladas con efecto sticky |
| Animaciones Framer Motion | ✅ Completo | Animaciones de entrada en viewport |
| Rebranding a Cognitio | ✅ Completo | Navbar y navegación actualizados |

### ❌ No Iniciado (Requerido para MVP)

| Funcionalidad | Prioridad | Esfuerzo |
|---------|----------|--------|
| Edición de cursos | Alta | Medio |
| Gestión de perfil | Media | Pequeño |
| Flujo de reseteo de contraseña | Media | Pequeño |

---

## Definición del MVP

### Funcionalidades Core del MVP (Must Have)

1. **Los estudiantes pueden:**
   - Navegar y buscar cursos
   - Ver detalles del curso y contenido de vista previa
   - Comprar cursos vía Stripe
   - Ver lecciones de video
   - Seguir su progreso (marcar capítulos como completados)
   - Ver sus cursos inscritos

2. **Los instructores pueden:**
   - Crear cursos con capítulos
   - Cargar videos vía Mux
   - Cargar imágenes thumbnail de cursos
   - Establecer precios y categorías
   - Publicar/despublicar cursos
   - Editar cursos existentes
   - Ver analytics básicos

3. **La plataforma proporciona:**
   - Autenticación segura
   - Procesamiento de pagos
   - Hosting y reproducción de video
   - Persistencia de progreso

---

## Fases de Desarrollo

### Fase 1: Correcciones Core (Semana 1) ✅ COMPLETADA
**Objetivo:** Corregir gaps de funcionalidad existentes

| Tarea | Prioridad | Complejidad | Estado | Notas |
|------|----------|------------|--------|-------|
| Corregir acceso de instructores a sus propios cursos | Alta | Pequeña | ✅ Completo | Instructores ahora pueden acceder a sus propios videos |
| Implementar carga de imagen de curso | Alta | Media | ✅ Completo | Storage Supabase con validación de archivo |
| Remover elementos UI sin usar | Baja | Pequeña | ✅ Completo | Removido botón "Watch Demo" |

**Entregables:**
- ✅ Dueños de cursos siempre pueden reproducir sus videos
- ✅ Instructores pueden cargar thumbnails de cursos
- ✅ UI/UX mejorado con remoción de botones placeholder

### Fase 2: Seguimiento de Progreso (Semana 2) ✅ COMPLETADA
**Objetivo:** Completar funcionalidades de progreso del estudiante

| Tarea | Prioridad | Complejidad | Estado | Notas |
|------|----------|------------|--------|-------|
| Botón marcar capítulo completado | Alta | Pequeña | ✅ Completo | Botón mostrado para cursos comprados |
| Persistencia de progreso | Alta | Pequeña | ✅ Completo | Guarda en tabla user_progress |
| Visualización de completación de capítulos | Alta | Pequeña | ✅ Completo | Checkmarks mostrados en lista de capítulos |

**Entregables:**
- ✅ Estudiantes pueden marcar manualmente capítulos como completados
- ✅ Progreso persiste entre sesiones
- ✅ Lista de capítulos muestra estado de completación

### Fase 3: Edición de Cursos (Semana 2-3)
**Objetivo:** Permitir a instructores editar cursos publicados

| Tarea | Prioridad | Complejidad | Descripción |
|------|----------|------------|-------------|
| Página de edición de curso | Alta | Media | Ruta /teacher/courses/:id/edit |
| Actualizar detalles del curso | Alta | Pequeña | Título, descripción, precio, categoría |
| Editar capítulos | Alta | Media | Agregar, remover, reordenar capítulos |
| Reemplazar videos de capítulos | Media | Media | Cargar nuevo video para capítulo existente |
| Eliminar curso | Media | Pequeña | Con diálogo de confirmación |

**Entregables:**
- Instructores pueden editar completamente sus cursos
- Cambios se reflejan inmediatamente para estudiantes
- Eliminación segura con confirmación

### Fase 4: Gestión de Usuarios (Semana 3)
**Objetivo:** Completar funcionalidades de perfil de usuario

| Tarea | Prioridad | Complejidad | Descripción |
|------|----------|------------|-------------|
| Página de configuración de perfil | Media | Pequeña | Ver/editar info de perfil |
| Carga de avatar | Baja | Pequeña | Cargar foto de perfil |
| Cambio de contraseña | Media | Pequeña | Formulario de cambio de contraseña |
| Reseteo de contraseña | Media | Media | Flujo de reseteo basado en email |

**Entregables:**
- Usuarios pueden actualizar su perfil
- Gestión de contraseña completa

### Fase 5: Analytics y Pulido (Semana 4)
**Objetivo:** Insights para instructores y mejoras de UX

| Tarea | Prioridad | Complejidad | Descripción |
|------|----------|------------|-------------|
| Datos de analytics reales | Media | Media | Conectar dashboard a datos reales de DB |
| Desglose de ingresos | Media | Pequeña | Visualización de ingresos por curso |
| Métricas de inscripción | Media | Pequeña | Conteo de estudiantes por curso |
| Notificaciones por email | Baja | Media | Email de bienvenida, confirmación de compra |
| Estados de carga/error | Baja | Pequeña | Mejorar manejo de edge cases |

**Entregables:**
- Instructores ven analytics reales
- Plataforma se siente pulida y completa

---

## Arquitectura Técnica

### Stack Actual
```
Frontend: React 18 + TypeScript + Vite + Tailwind CSS
UI: shadcn/ui + Radix UI + Framer Motion
Backend: Supabase (PostgreSQL + Auth + Edge Functions)
Video: Mux
Pagos: Stripe
Estado: TanStack Query
i18n: i18next (español por defecto)
```

### Esquema de Base de Datos (Existente)
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   profiles  │     │   courses   │     │  chapters   │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ id (PK)     │     │ id (PK)     │     │ id (PK)     │
│ email       │     │ teacher_id  │────>│ course_id   │
│ full_name   │     │ title       │     │ title       │
│ role        │     │ description │     │ position    │
│ avatar_url  │     │ price       │     │ mux_playback│
└─────────────┘     │ category    │     │ duration    │
                    │ is_published│     │ is_preview  │
                    │ image_url   │     └─────────────┘
                    └─────────────┘
                          │
                          ▼
┌─────────────┐     ┌─────────────┐
│  purchases  │     │user_progress│
├─────────────┤     ├─────────────┤
│ id (PK)     │     │ id (PK)     │
│ user_id     │     │ user_id     │
│ course_id   │     │ chapter_id  │
│ amount      │     │ is_completed│
│ stripe_id   │     │ completed_at│
└─────────────┘     └─────────────┘
```

### Bucket de Storage Requerido
```sql
-- Bucket de thumbnails de cursos (ya creado)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('course-images', 'course-images', true);
```

---

## Evaluación de Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|------|-------------|--------|------------|
| Rate limits de API Mux | Baja | Media | Implementar lógica de retry, encolar cargas |
| Fallos de webhook Stripe | Media | Alta | Agregar verificación manual de compras |
| Cargas de video grandes | Media | Media | Mostrar progreso, manejar timeouts |
| Rendimiento de base de datos | Baja | Alta | Agregar índices, optimizar queries |

---

## Métricas de Éxito

### Criterios de Lanzamiento del MVP
- [x] Instructores pueden crear cursos con videos end-to-end
- [x] Estudiantes pueden comprar y ver cursos
- [x] Seguimiento de progreso funciona confiablemente
- [ ] Sin bugs críticos o errores de consola
- [ ] Mobile responsive en todas las páginas
- [ ] Tiempos de carga de página < 3 segundos

### KPIs Post-MVP
- Tasa de completación de creación de cursos > 80%
- Tasa de éxito de reproducción de video > 99%
- Tasa de conversión de checkout > 60%
- Tasa de completación de cursos por estudiantes > 30%

---

## Resumen de Timeline

| Fase | Duración | Enfoque |
|-------|----------|-------|
| Fase 1 | Semana 1 | Correcciones core ✅ |
| Fase 2 | Semana 2 | Seguimiento de progreso ✅ |
| Fase 3 | Semana 2-3 | Edición de cursos |
| Fase 4 | Semana 3 | Gestión de usuarios |
| Fase 5 | Semana 4 | Analytics y pulido |

**Estimado Total: 4 semanas hasta MVP completo**

---

## Próximos Pasos

### Completado (Diciembre 2024)
1. ✅ Corregida lógica de acceso a capítulos para dueños de cursos
2. ✅ Implementada carga de imagen de curso con storage Supabase
3. ✅ Completadas funcionalidades de seguimiento de progreso
4. ✅ Removidos elementos UI sin usar
5. ✅ Creada página Sobre Nosotros con tarjetas apiladas
6. ✅ Agregadas animaciones Framer Motion
7. ✅ Rebrandeado de "LearnHub" a "Cognitio"

### Prioridades Inmediatas
1. **Edición de Cursos**: Permitir a instructores editar cursos publicados
2. **Testing y Validación**: Testing comprehensivo de todas las funcionalidades implementadas
3. **Gestión de Usuarios**: Configuración de perfil y reseteo de contraseña
4. **Analytics**: Conectar dashboard de instructor a datos reales

---

## Cambios Recientes (Diciembre 29, 2024)

### 1. Página Sobre Nosotros
- **Implementado efecto de tarjetas apiladas (sticky stack)** para perfiles de instructores
  - 8 tarjetas en total (4 por fundador)
  - Gustavo González Bonorino y Augusto González Bonorino
  - Posiciones sticky con offsets dinámicos
  - Z-index incremental para efecto de apilamiento
  - Layout 60% bio / 40% foto

### 2. Animaciones con Framer Motion
- **Agregadas animaciones de entrada** a tarjetas de instructor
  - Fade in desde abajo (y: 60 → 0)
  - Scale in (0.95 → 1)
  - Duración suave de 0.5s
  - Delay de 0.1s entre tarjetas

### 3. Mejoras de UI
- **Tarjetas más angostas** (max-w-3xl) para mejor legibilidad
- **Navbar actualizado** con links: Inicio | Cursos | Sobre Nosotros
- **Footer de página** con lema: "Nos dedicamos a aprender enseñando"

### 4. Limpieza de Código
- **Removido InstructorCardDeck.tsx** (reemplazado por StickyInstructorCard)
- **Actualizada estructura de archivos** en documentación

---

## Apéndice: Estructura de Archivos

```
src/
├── components/
│   ├── ui/                     # Componentes shadcn/ui
│   ├── ChapterList.tsx         # Navegación de capítulos
│   ├── CourseCard.tsx          # Tarjeta de visualización de curso
│   ├── Navbar.tsx              # Navegación global (Cognitio)
│   ├── ProgressCard.tsx        # Visualización de estadísticas
│   ├── StickyInstructorCard.tsx # Tarjeta de instructor con efecto sticky
│   ├── TeacherSidebar.tsx      # Navegación de instructor
│   ├── VideoPlayer.tsx         # Wrapper de reproductor Mux
│   └── VideoUpload.tsx         # Componente de carga de video
├── pages/
│   ├── Index.tsx               # Página de inicio
│   ├── AuthPage.tsx            # Login/signup
│   ├── CoursePage.tsx          # Detalle/reproductor de curso
│   ├── CoursesPage.tsx         # Catálogo de cursos
│   ├── Dashboard.tsx           # Dashboard del estudiante
│   ├── CreateCourse.tsx        # Creación de cursos
│   ├── AboutPage.tsx           # Página Sobre Nosotros
│   ├── TeacherDashboard.tsx
│   ├── TeacherCourses.tsx
│   ├── TeacherAnalytics.tsx
│   └── TeacherSettings.tsx
├── contexts/
│   └── AuthContext.tsx         # Gestión de estado de auth
├── hooks/
│   └── useUserRole.ts          # Acceso basado en roles
├── locales/
│   ├── es.json                 # Traducciones español
│   └── en.json                 # Traducciones inglés (futuro)
└── integrations/
    └── supabase/               # Cliente y tipos Supabase
```
