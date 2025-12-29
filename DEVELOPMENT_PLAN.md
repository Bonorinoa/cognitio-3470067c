# Plan de Desarrollo Cognitio v1.1 - v2.0

## Visión del Producto

**Cognitio** es un ecosistema académico **exclusivo por invitación** y **centrado en el instructor**. No es un marketplace abierto como Udemy.

### Filosofía Core
- Maximizar **autonomía del instructor y retención de ingresos**
- Mantener la arquitectura **simple de mantener** para un equipo pequeño
- Instructores son **curados manualmente** por Admins (no hay signup público de instructor)
- Cualquier usuario puede registrarse como estudiante

### Propuesta de Valor
> Cognitio es un "Instructor Studio" exclusivo: LMS ligero + storefront + asistente de publicación con IA para instructores curados.

---

## Personas de Usuario

### 1. Instructor Curado (Cliente Principal)
- Académicos, investigadores, consultores; frecuentemente no técnicos, 40-70+ años
- **Necesita:**
  - Vender **cursos públicos** (para ingresos generales)
  - Ofrecer **cursos privados** (para cohortes específicas, ej: estudiantes universitarios)
  - Una "base" simple para su identidad digital
  - Ayuda con IA para generar blogs/newsletters/podcasts desde su material
- **Dolor:** Odia la autopromoción y las UIs complejas

### 2. Estudiante de por Vida
- Profesionales o estudiantes buscando expertise **nicho y de alta calidad**
- **Necesita:**
  - Experiencia de lectura limpia
  - Reproductor de video sin distracciones con capítulos
  - Seguimiento de progreso
  - Enlaces claros a otras ofertas del instructor

### 3. Admin de Plataforma
- Equipo interno pequeño (Augusto, Gustavo)
- **Necesita:**
  - Gestionar roles (quién es instructor/admin)
  - Manejar tareas de soporte (reembolsos, inscripciones manuales)

---

## Estado Actual (v1.0.0)

### ✅ Completado
| Categoría | Funcionalidad |
|-----------|---------------|
| **Auth** | Email/contraseña, roles (admin/teacher/student), rutas protegidas |
| **Cursos** | Creación, capítulos, borrador/publicación, imágenes, Mux video |
| **Pagos** | Stripe checkout, registro de compras |
| **Estudiante** | Catálogo, inscripción, progreso, dashboard |
| **Instructor** | Dashboard, sidebar, lista de cursos |
| **UI** | Página About con sticky cards, Framer Motion, branding Cognitio |

### ⚠️ Gaps vs Visión
| Área | Estado Actual | Visión |
|------|---------------|--------|
| Terminología | `teacher` en código/DB | `instructor` |
| Rutas | `/teacher/*` | `/instructor/*` + `/admin/*` |
| Visibilidad | `is_published` boolean | `visibility` enum (public/private/unlisted) |
| Cursos Privados | No existe | `course_memberships` para inscripción manual |
| Panel Admin | No existe | Gestión de roles, soporte |
| Perfil Instructor | Básico | Bio, afiliación, servicios, página pública |
| AI Content Studio | No existe | Generación de blogs/newsletters desde cursos |

---

## Roadmap de Versiones

### Control de Versiones y Estrategia de Release

| Versión | Enfoque | Riesgo | Breaking Changes |
|---------|---------|--------|------------------|
| v1.1 | Refactor terminología frontend | Bajo | Rutas cambian |
| v1.2 | Migración terminología DB | Medio | Schema cambia |
| v1.3 | Sistema de visibilidad de cursos | Medio | Nuevas reglas de acceso |
| v1.4 | Panel Admin | Bajo | Ninguno |
| v1.5 | Perfiles de instructor mejorados | Bajo | Ninguno |
| v1.6 | Edición de cursos | Medio | Ninguno |
| v1.7 | Gestión de usuarios y seguridad | Medio | Ninguno |
| v1.8 | Analytics reales | Bajo | Ninguno |
| v1.9 | Servicios de instructor | Medio | Ninguno |
| v2.0 | AI Content Studio | Medio | Ninguno |

---

## v1.1 - Alineación de Fundamentos (Frontend)

**Objetivo:** Alinear terminología y rutas del frontend con la visión sin cambios de base de datos.

**Riesgo:** Bajo - cambios puramente frontend

### Tareas
| Tarea | Archivos Afectados | Complejidad |
|-------|-------------------|-------------|
| Renombrar rutas `/teacher/*` a `/instructor/*` | App.tsx | Pequeña |
| Renombrar `TeacherDashboard` → `InstructorDashboard` | pages/, components/ | Media |
| Renombrar `TeacherSidebar` → `InstructorSidebar` | components/ | Pequeña |
| Renombrar `TeacherCourses` → `InstructorCourses` | pages/ | Pequeña |
| Renombrar `TeacherAnalytics` → `InstructorAnalytics` | pages/ | Pequeña |
| Renombrar `TeacherSettings` → `InstructorSettings` | pages/ | Pequeña |
| Actualizar `RequireTeacher` → `RequireInstructor` | components/ | Pequeña |
| Actualizar hook: `isTeacher` → `isInstructor` | hooks/useUserRole.ts | Pequeña |
| Actualizar links en Navbar | components/Navbar.tsx | Pequeña |
| Actualizar traducciones | locales/*.json | Pequeña |

### Checkpoint de Decisión
- [ ] Confirmar estructura de rutas antes de proceder
- [ ] Revisar impacto en tests existentes

### Cambios de Schema
Ninguno - la base de datos mantiene `teacher_id` por ahora

### Entregables
- [ ] Todas las rutas usan `/instructor/*`
- [ ] Todos los componentes usan terminología "Instructor"
- [ ] Tests actualizados y pasando

---

## v1.2 - Migración de Terminología en DB

**Objetivo:** Alinear schema de base de datos con terminología "instructor"

**Riesgo:** Medio - requiere migración cuidadosa y testing

### Tareas
| Tarea | Complejidad |
|-------|-------------|
| Agregar columna `instructor_id` a courses (paralela a `teacher_id`) | Pequeña |
| Migrar datos: `UPDATE courses SET instructor_id = teacher_id` | Pequeña |
| Actualizar políticas RLS para usar `instructor_id` | Media |
| Agregar valor `'instructor'` al enum `app_role` | Pequeña |
| Migrar roles existentes de `teacher` a `instructor` | Media |
| Actualizar función `has_role()` | Pequeña |
| Actualizar frontend para usar nueva columna | Media |
| Deprecar `teacher_id` (mantener para compatibilidad) | Pequeña |

### Checkpoint de Decisión
- [ ] Estrategia de migración aprobada
- [ ] Plan de rollback definido
- [ ] Testing en ambiente de staging

### Cambios de Schema Requeridos
```sql
-- Agregar columna instructor_id
ALTER TABLE courses ADD COLUMN instructor_id uuid;

-- Migrar datos existentes
UPDATE courses SET instructor_id = teacher_id;

-- Agregar valor al enum (PostgreSQL no permite modificación directa)
ALTER TYPE app_role ADD VALUE 'instructor';

-- Migrar roles existentes
UPDATE user_roles SET role = 'instructor' WHERE role = 'teacher';
```

### Entregables
- [ ] Schema de DB usa terminología "instructor"
- [ ] Políticas RLS actualizadas
- [ ] Frontend usa nuevas columnas
- [ ] Compatibilidad hacia atrás mantenida

---

## v1.3 - Sistema de Visibilidad de Cursos

**Objetivo:** Implementar visibilidad public/private/unlisted para cursos

**Riesgo:** Medio - nueva lógica de control de acceso

### Tareas
| Tarea | Complejidad |
|-------|-------------|
| Crear tipo enum `course_visibility` | Pequeña |
| Agregar columna `visibility` a courses (default: `public`) | Pequeña |
| Crear tabla `course_memberships` para cursos privados | Media |
| Actualizar políticas RLS para acceso basado en visibilidad | Media |
| Actualizar CoursesPage para filtrar por visibilidad | Pequeña |
| UI para que instructor configure visibilidad del curso | Media |
| UI para inscripción manual de estudiantes (cursos privados) | Media |

### Checkpoint de Decisión
- [ ] Workflow de inscripción para cursos privados (manual vs link de invitación)
- [ ] ¿Los cursos privados pueden tener precio o solo gratuitos?

### Cambios de Schema Requeridos
```sql
-- Enum de visibilidad
CREATE TYPE course_visibility AS ENUM ('public', 'private', 'unlisted');

-- Agregar a courses
ALTER TABLE courses ADD COLUMN visibility course_visibility DEFAULT 'public';

-- Tabla de membresías para cursos privados
CREATE TABLE course_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  user_id uuid NOT NULL,
  enrolled_at timestamptz DEFAULT now(),
  enrolled_by uuid, -- instructor que inscribió
  UNIQUE(course_id, user_id)
);

-- Habilitar RLS
ALTER TABLE course_memberships ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Instructors can manage memberships"
ON course_memberships FOR ALL
USING (EXISTS (
  SELECT 1 FROM courses 
  WHERE courses.id = course_memberships.course_id 
  AND courses.teacher_id = auth.uid()
));

CREATE POLICY "Students can view their memberships"
ON course_memberships FOR SELECT
USING (user_id = auth.uid());
```

### Entregables
- [ ] Cursos tienen campo de visibilidad
- [ ] Cursos privados solo accesibles por miembros
- [ ] UI de instructor para gestionar visibilidad
- [ ] UI de instructor para inscribir estudiantes

---

## v1.4 - Panel de Administración

**Objetivo:** Funcionalidad básica de admin para gestión de roles

**Riesgo:** Bajo - UI solamente, usa sistema de roles existente

### Tareas
| Tarea | Complejidad |
|-------|-------------|
| Crear ruta `/admin` (protegida por rol admin) | Pequeña |
| Crear componente `RequireAdmin` | Pequeña |
| Construir dashboard admin con lista de usuarios | Media |
| Implementar asignar/remover rol instructor | Media |
| Ver todos los cursos (publicados y no publicados) | Pequeña |
| Agregar navegación admin en sidebar/dropdown | Pequeña |

### Checkpoint de Decisión
- [ ] Alcance de capacidades admin (¿incluir reembolsos?)
- [ ] ¿Logs de auditoría para acciones admin?

### Cambios de Schema
Ninguno - el rol admin ya existe en `user_roles`

### Entregables
- [ ] Ruta `/admin` accesible solo para admins
- [ ] Admins pueden asignar/remover rol instructor
- [ ] Admins pueden ver todos los cursos

---

## v1.5 - Perfiles de Instructor Mejorados

**Objetivo:** Páginas públicas de instructor y datos de perfil más ricos

**Riesgo:** Bajo - cambios aditivos

### Tareas
| Tarea | Complejidad |
|-------|-------------|
| Extender tabla `profiles` con campos de instructor | Pequeña |
| Crear página pública de instructor: `/instructors/:id` | Media |
| Agregar edición de perfil de instructor en settings | Media |
| Vincular cursos a perfil público del instructor | Pequeña |
| Mostrar info del instructor en páginas de curso | Pequeña |

### Checkpoint de Decisión
- [ ] ¿Qué campos son requeridos vs opcionales?
- [ ] ¿Mostrar cursos del instructor en su perfil público?

### Cambios de Schema Requeridos
```sql
-- Campos adicionales para perfiles de instructor
ALTER TABLE profiles ADD COLUMN bio text;
ALTER TABLE profiles ADD COLUMN affiliation text;
ALTER TABLE profiles ADD COLUMN website_url text;
ALTER TABLE profiles ADD COLUMN is_public boolean DEFAULT false;
```

### Entregables
- [ ] Instructores pueden completar su perfil
- [ ] Páginas públicas de instructor disponibles
- [ ] Cursos muestran info del instructor

---

## v1.6 - Edición de Cursos

**Objetivo:** Permitir a instructores editar cursos publicados

**Riesgo:** Medio - debe preservar progreso de estudiantes

### Tareas
| Tarea | Complejidad |
|-------|-------------|
| Crear ruta `/instructor/courses/:id/edit` | Pequeña |
| Formulario de edición de curso (título, descripción, precio, categoría, visibilidad) | Media |
| Edición de capítulos (agregar, remover, reordenar) | Media |
| Reemplazo de video para capítulos existentes | Media |
| Eliminación de curso con confirmación | Pequeña |
| Funcionalidad "despublicar" | Pequeña |

### Checkpoint de Decisión
- [ ] ¿Pueden los instructores editar cursos con estudiantes inscritos?
- [ ] ¿Qué pasa con el progreso si se eliminan capítulos?

### Cambios de Schema
Ninguno

### Entregables
- [ ] Instructores pueden editar completamente sus cursos
- [ ] Cambios se reflejan inmediatamente
- [ ] Eliminación segura con confirmación

---

## v1.7 - Gestión de Usuarios y Seguridad

**Objetivo:** Gestión completa de cuenta de usuario

**Riesgo:** Medio - sensible a seguridad

### Tareas
| Tarea | Complejidad |
|-------|-------------|
| Página de configuración de perfil (nombre, avatar) | Pequeña |
| Funcionalidad de cambio de contraseña | Pequeña |
| Flujo de reseteo de contraseña (email) | Media |
| Flujo de eliminación de cuenta (con anonimización) | Media |
| Gestión de preferencias de email | Pequeña |

### Checkpoint de Decisión
- [ ] Política de retención de datos para cuentas eliminadas
- [ ] ¿Qué datos se anonimizan vs eliminan?

### Cambios de Schema
Ninguno - usa Supabase Auth

### Entregables
- [ ] Usuarios pueden actualizar su perfil
- [ ] Gestión de contraseña completa
- [ ] Flujo de eliminación de cuenta funcional

---

## v1.8 - Analytics Reales

**Objetivo:** Conectar dashboard de instructor a datos reales

**Riesgo:** Bajo

### Tareas
| Tarea | Complejidad |
|-------|-------------|
| Query de purchases para datos de ingresos | Pequeña |
| Query de inscripciones para conteo de estudiantes | Pequeña |
| Query de user_progress para tasas de completación | Media |
| Construir vistas de series temporales (semanal/mensual) | Media |
| Agregar funcionalidad de exportación (CSV) | Pequeña |

### Checkpoint de Decisión
- [ ] Granularidad de analytics (diario/semanal/mensual)
- [ ] ¿Qué métricas son más importantes?

### Cambios de Schema
Puede necesitar vistas o materialized views para rendimiento

### Entregables
- [ ] Dashboard muestra ingresos reales
- [ ] Métricas de estudiantes y progreso
- [ ] Exportación de datos disponible

---

## v1.9 - Servicios de Instructor (Futuro)

**Objetivo:** Permitir a instructores ofrecer consultoría/servicios

**Riesgo:** Medio - área de funcionalidad nueva

### Tareas
| Tarea | Complejidad |
|-------|-------------|
| Crear tabla `instructor_services` | Pequeña |
| Construir UI de gestión de servicios | Media |
| Mostrar servicios en perfil del instructor | Pequeña |
| Sistema básico de reserva/consulta (email inicialmente) | Media |

### Checkpoint de Decisión
- [ ] Complejidad del sistema de reservas (email vs integración calendario)
- [ ] ¿Pagos para servicios a través de la plataforma?

### Cambios de Schema Requeridos
```sql
CREATE TABLE instructor_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  price numeric,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE instructor_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active services"
ON instructor_services FOR SELECT
USING (is_active = true);

CREATE POLICY "Instructors can manage own services"
ON instructor_services FOR ALL
USING (instructor_id = auth.uid());
```

### Entregables
- [ ] Instructores pueden listar servicios
- [ ] Servicios visibles en perfil público
- [ ] Sistema básico de contacto/reserva

---

## v2.0 - AI Content Studio (Fase Final)

**Objetivo:** Creación de contenido asistida por IA para instructores

**Riesgo:** Medio - nueva integración de IA

### Tareas
| Tarea | Complejidad |
|-------|-------------|
| Crear ruta `/instructor/content` | Pequeña |
| Construir UI del AI Content Studio | Media |
| Crear edge function para llamadas a LLM (Lovable AI) | Media |
| Crear tabla `instructor_contents` para borradores | Pequeña |
| Implementar generación de contenido (blog, newsletter, podcast, landing) | Alta |
| Gestión de borradores (guardar, editar, publicar/exportar) | Media |
| Etiquetas de transparencia de IA | Pequeña |

### Checkpoint de Decisión
- [ ] ¿Qué modelo de Lovable AI usar? (gemini-2.5-flash recomendado)
- [ ] ¿Límites de generación por instructor?

### Cambios de Schema Requeridos
```sql
CREATE TABLE instructor_contents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content_type text NOT NULL, -- 'blog', 'newsletter', 'podcast', 'landing'
  title text,
  body text,
  source_course_id uuid REFERENCES courses(id),
  is_ai_generated boolean DEFAULT true,
  status text DEFAULT 'draft', -- 'draft', 'published', 'archived'
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE instructor_contents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Instructors can manage own content"
ON instructor_contents FOR ALL
USING (instructor_id = auth.uid());
```

### Entregables
- [ ] AI Content Studio funcional
- [ ] Generación de múltiples tipos de contenido
- [ ] Sistema de borradores con edición
- [ ] Transparencia sobre contenido generado por IA

---

## Non-Goals (Fuera de Alcance)

Per la visión de Cognitio, lo siguiente está **FUERA DE ALCANCE**:

### ❌ Funcionalidades LMS Complejas
- Assignments y quizzes
- Motor de exámenes / proctoring
- Gradebooks
- Importación SCORM/xAPI

### ❌ Funcionalidades Enterprise
- SAML SSO
- Integraciones HR/ERP
- Jerarquías organizacionales complejas

### ❌ Otros
- Foros de discusión pesados y sistemas de moderación
- Calificación basada en IA o evaluación automática de estudiantes
- Precios de suscripción/bundles (solo pagos únicos por ahora)
- Signup abierto de instructores (política de solo invitación)

---

## Arquitectura Técnica

### Stack Actual (No Cambiar)
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

### Esquema de Base de Datos Actual
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
                    │ is_featured │     └─────────────┘
                    │ image_url   │
                    └─────────────┘
                          │
      ┌───────────────────┼───────────────────┐
      ▼                   ▼                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  purchases  │     │user_progress│     │ user_roles  │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ id (PK)     │     │ id (PK)     │     │ id (PK)     │
│ user_id     │     │ user_id     │     │ user_id     │
│ course_id   │     │ chapter_id  │     │ role        │
│ amount      │     │ is_completed│     │ created_at  │
│ stripe_id   │     │ completed_at│     └─────────────┘
└─────────────┘     └─────────────┘
```

### Schema Futuro (Post v1.3)
```
Nuevas tablas/columnas:
- courses.visibility (enum: public/private/unlisted)
- courses.instructor_id (reemplazo de teacher_id)
- course_memberships (curso_id, user_id, enrolled_by)
- profiles.bio, affiliation, website_url, is_public
- instructor_services (id, instructor_id, title, price, is_active)
- instructor_contents (id, instructor_id, content_type, body, status)
```

---

## Evaluación de Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Migración de terminología rompe funcionalidad | Media | Alto | Testing exhaustivo, feature flags |
| Rate limits de API Mux | Baja | Media | Lógica de retry, cola de cargas |
| Fallos de webhook Stripe | Media | Alta | Verificación manual de compras |
| Rendimiento de DB con nuevas tablas | Baja | Media | Índices, optimización de queries |
| Complejidad de AI Content Studio | Media | Media | MVP simple, iterar |

---

## Métricas de Éxito

### Criterios por Versión
- **v1.1-v1.2**: Terminología consistente, tests pasando
- **v1.3**: Cursos privados funcionando, inscripción manual exitosa
- **v1.4**: Admins pueden gestionar roles
- **v1.5**: Páginas públicas de instructor visibles
- **v1.6**: Edición de cursos sin perder progreso de estudiantes
- **v1.7**: Flujo de eliminación de cuenta funcional
- **v1.8**: Dashboard con datos reales
- **v1.9**: Servicios visibles y contactables
- **v2.0**: AI genera contenido útil desde material de cursos

### KPIs Post-v2.0
- Tasa de completación de cursos > 30%
- Instructores usando AI Content Studio > 50%
- Tiempo de configuración de instructor < 30 minutos
- Satisfacción de instructor (NPS) > 50

---

## Próximos Pasos Inmediatos

1. **Confirmar prioridad de v1.1** - ¿Empezar con refactor de terminología?
2. **Definir alcance de v1.4** - ¿Qué capacidades admin son esenciales?
3. **Diseñar workflow de cursos privados** - ¿Manual o link de invitación?
4. **Revisar modelo de datos** - ¿Cambios adicionales necesarios?

---

*Última actualización: Diciembre 2024*
*Versión del documento: 2.0*
