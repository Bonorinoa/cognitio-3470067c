# Plan de Pruebas E2E - Cognitio v3.9.0

**Versión:** v3.9.0  
**Fecha:** Enero 2, 2026  
**Propósito:** Evaluación exhaustiva de funcionalidades antes del release público

---

## Índice

1. [Pruebas de UI/UX - Página de Inicio](#1-pruebas-de-uiux---página-de-inicio)
2. [Pruebas de Autenticación](#2-pruebas-de-autenticación)
3. [Pruebas de Catálogo de Cursos](#3-pruebas-de-catálogo-de-cursos)
4. [Pruebas de Dashboard del Estudiante](#4-pruebas-de-dashboard-del-estudiante)
5. [Pruebas de Dashboard del Instructor](#5-pruebas-de-dashboard-del-instructor)
6. [Pruebas de AI Content Studio](#6-pruebas-de-ai-content-studio)
7. [Pruebas de Base de Datos y Analytics](#7-pruebas-de-base-de-datos-y-analytics)
8. [Pruebas de Pagos (Stripe)](#8-pruebas-de-pagos-stripe)
9. [Pruebas de Video (Mux)](#9-pruebas-de-video-mux)

---

## 1. Pruebas de UI/UX - Página de Inicio (`/`)

### Hipótesis a Verificar

| ID | Hipótesis | Comportamiento Esperado | Cómo Probar |
|----|-----------|------------------------|-------------|
| UI-01 | Hero background tiene animación sutil | Los blobs animados deben moverse suavemente con `ease-in-out` durante 10s | Observar visualmente la página de inicio durante 15+ segundos |
| UI-02 | Animación respeta `prefers-reduced-motion` | Si el usuario tiene reduced motion activado, las animaciones deben estar deshabilitadas | Activar reduced motion en el OS y verificar |
| UI-03 | Geometric patterns visibles | Los puntos flotantes y líneas de conexión deben ser visibles en el hero | Inspeccionar visualmente el fondo del hero |
| UI-04 | Cards tienen hover effects consistentes | Todas las tarjetas deben tener `hover:shadow-lg hover:-translate-y-1` | Hacer hover sobre CourseCard, ServiceCard, InstructorCatalogCard |
| UI-05 | Navegación responsive funciona | El menú hamburguesa debe aparecer en móvil y abrir correctamente | Redimensionar a <768px y probar menú |
| UI-06 | Glassmorphism en navbar | La navbar debe tener blur sutil cuando hay contenido detrás | Hacer scroll para que contenido pase detrás del navbar |

### Criterios de Éxito
- ✅ Todas las animaciones funcionan suavemente sin lag
- ✅ Diseño responsive funciona en móvil (320px), tablet (768px) y desktop (1920px)
- ✅ Hover effects son consistentes en todos los componentes de tarjeta
- ✅ Respeta preferencias de accesibilidad del usuario

---

## 2. Pruebas de Autenticación (`/auth`)

### Hipótesis a Verificar

| ID | Hipótesis | Comportamiento Esperado | Cómo Probar |
|----|-----------|------------------------|-------------|
| AUTH-01 | Login con email válido funciona | Usuario debe poder iniciar sesión y ser redirigido a dashboard | Usar credenciales de test válidas |
| AUTH-02 | Error en credenciales inválidas | Mensaje de error claro debe aparecer | Intentar login con email/password incorrectos |
| AUTH-03 | Registro de nuevo usuario funciona | Email de confirmación debe enviarse | Registrar nuevo usuario con email real |
| AUTH-04 | Recuperación de contraseña funciona | Email de reset debe enviarse | Usar función "Olvidé contraseña" |
| AUTH-05 | Redirección post-login correcta | Instructor → `/instructor`, Student → `/dashboard` | Verificar con diferentes roles |

### Criterios de Éxito
- ✅ Autenticación funciona con Supabase Auth
- ✅ Tokens se almacenan de forma segura
- ✅ Redirecciones basadas en rol son correctas
- ✅ Mensajes de error son claros y en español

---

## 3. Pruebas de Catálogo de Cursos (`/courses`)

### Hipótesis a Verificar

| ID | Hipótesis | Comportamiento Esperado | Cómo Probar |
|----|-----------|------------------------|-------------|
| CAT-01 | Solo cursos públicos visibles | Cursos private/unlisted NO deben aparecer sin autenticación | Verificar catálogo como usuario anónimo |
| CAT-02 | Filtro por categoría funciona | Seleccionar categoría debe filtrar cursos correctamente | Probar cada categoría disponible |
| CAT-03 | Filtro "Destacados" funciona | Badge "Destacado" debe aparecer y filtrar correctamente | Verificar cursos marcados como featured |
| CAT-04 | Búsqueda por texto funciona | Buscar por título/descripción debe retornar resultados correctos | Buscar términos conocidos |
| CAT-05 | Loading skeletons aparecen | Mientras carga, CourseCardSkeleton debe mostrarse | Throttle network y observar |
| CAT-06 | Empty state muestra mensaje apropiado | Si no hay cursos, EmptyState con acción debe aparecer | Buscar término que no existe |

### Criterios de Éxito
- ✅ RLS policies funcionan correctamente (cursos privados no visibles)
- ✅ Filtros y búsqueda funcionan sin errores
- ✅ Loading states mejoran UX
- ✅ Empty states son informativos

---

## 4. Pruebas de Dashboard del Estudiante (`/dashboard`)

### Hipótesis a Verificar

| ID | Hipótesis | Comportamiento Esperado | Cómo Probar |
|----|-----------|------------------------|-------------|
| STUD-01 | Cursos comprados aparecen | Cursos con purchase deben mostrarse | Verificar con usuario que tiene compras |
| STUD-02 | Cursos por membership aparecen | Cursos private/unlisted con membership deben mostrarse | Verificar con usuario enrollado manualmente |
| STUD-03 | Progreso se muestra correctamente | Porcentaje de completado debe ser preciso | Verificar con curso parcialmente completado |
| STUD-04 | Navegación a continuar curso funciona | Click en "Continuar" debe ir al último capítulo visto | Probar con curso en progreso |

### Criterios de Éxito
- ✅ Dashboard muestra cursos de purchases Y memberships combinados
- ✅ Progreso se calcula correctamente
- ✅ Navegación a cursos funciona sin errores

---

## 5. Pruebas de Dashboard del Instructor (`/instructor`)

### Hipótesis a Verificar

| ID | Hipótesis | Comportamiento Esperado | Cómo Probar |
|----|-----------|------------------------|-------------|
| INST-01 | Métricas muestran datos reales | Ingresos, inscripciones, etc. deben reflejar datos reales | Verificar con instructor que tiene cursos vendidos |
| INST-02 | Gráficos de analytics funcionan | Recharts debe renderizar correctamente | Verificar en `/instructor/analytics` |
| INST-03 | Lista de cursos propios correcta | Solo cursos creados por el instructor deben aparecer | Verificar con instructor con múltiples cursos |
| INST-04 | Sidebar sticky funciona | Sidebar debe permanecer fijo al scrollear | Scroll en páginas del instructor |
| INST-05 | Navegación a AI Studio disponible | Link a AI Studio debe aparecer en sidebar | Verificar presencia del link |

### Criterios de Éxito
- ✅ Analytics muestran datos precisos
- ✅ RLS policies aseguran que instructores solo ven sus propios datos
- ✅ UI es funcional y responsive

---

## 6. Pruebas de AI Content Studio (`/ai-studio`)

### Hipótesis a Verificar

| ID | Hipótesis | Comportamiento Esperado | Cómo Probar |
|----|-----------|------------------------|-------------|
| AI-01 | Dashboard muestra stats correctas | Documents count, style status, gen today, total gen deben ser precisos | Verificar con instructor que tiene documentos y generaciones |
| AI-02 | Quick actions navegación funciona | Cards de Blog Generator y Newsletter deben navegar/mostrar disabled correctamente | Click en cada card |
| AI-03 | Recent generations aparecen | Últimas 3 generaciones con botón "Cargar" deben mostrarse | Verificar con instructor con historial |
| AI-04 | Knowledge Base CRUD funciona | Crear, editar, toggle active, eliminar documentos debe funcionar | Probar cada operación |
| AI-05 | Style Profile se guarda | Configurar tone, length, audience debe persistir | Guardar y recargar página |
| AI-06 | Blog generation funciona E2E | Ingresar topic → generar → ver streaming → contenido final | Generar un blog completo |
| AI-07 | Daily limit se aplica | Después de 10 generaciones, debe mostrar límite alcanzado | Verificar contador en sidebar |
| AI-08 | Generation history save/load funciona | Guardar generación → cargar desde historial | Usar botón "Guardar" y luego "Cargar" |
| AI-09 | Refine feature funciona | Seleccionar texto → refinar → ver diff → aceptar/rechazar | Probar flujo completo de refinamiento |
| AI-10 | Export MD/TXT funciona | Descargar contenido generado en ambos formatos | Probar ambos botones de export |
| AI-11 | Mobile tab bar funciona | En móvil, tabs deben navegar correctamente | Probar en viewport móvil |
| AI-12 | Progress bar actualiza | Después de generar, progress bar debe actualizarse | Observar después de generar |

### Criterios de Éxito
- ✅ Integración con Lovable AI Gateway funciona sin errores
- ✅ Streaming de contenido es fluido
- ✅ Límites diarios se aplican correctamente
- ✅ Historial con soft-delete funciona (is_active flag)
- ✅ CRUD de documentos es robusto

---

## 7. Pruebas de Base de Datos y Analytics

### Hipótesis a Verificar

| ID | Hipótesis | Comportamiento Esperado | Cómo Probar |
|----|-----------|------------------------|-------------|
| DB-01 | RLS policies funcionan | Usuarios solo pueden acceder a sus propios datos | Intentar query cross-user (via Supabase dashboard) |
| DB-02 | ai_usage_logs registra llamadas AI | Cada generación debe crear entrada en ai_usage_logs | Verificar tabla después de generar |
| DB-03 | ai_generation_history soft-delete funciona | is_active=false cuando se elimina, pero registro persiste | Eliminar y verificar en tabla |
| DB-04 | Instructor analytics queries correctas | Datos de purchases, completions deben ser precisos | Comparar UI con queries directas |
| DB-05 | Foreign keys integridad | No debe haber orphan records | Verificar constraints en schema |

### Criterios de Éxito
- ✅ RLS policies están habilitadas en todas las tablas
- ✅ No hay data leaks entre usuarios
- ✅ Integridad referencial se mantiene

---

## 8. Pruebas de Pagos (Stripe)

### Hipótesis a Verificar

| ID | Hipótesis | Comportamiento Esperado | Cómo Probar |
|----|-----------|------------------------|-------------|
| PAY-01 | Checkout Stripe inicia | Botón comprar debe redirigir a Stripe Checkout | Iniciar compra de curso |
| PAY-02 | Webhook procesa purchase | Después de pago exitoso, course_purchases debe tener registro | Completar pago test (4242 4242 4242 4242) |
| PAY-03 | Acceso post-compra inmediato | Después de pago, curso debe aparecer en dashboard | Verificar dashboard post-pago |

### Criterios de Éxito
- ✅ Stripe Checkout funciona correctamente
- ✅ Webhooks procesan eventos sin fallos
- ✅ Acceso a cursos se otorga inmediatamente post-compra

---

## 9. Pruebas de Video (Mux)

### Hipótesis a Verificar

| ID | Hipótesis | Comportamiento Esperado | Cómo Probar |
|----|-----------|------------------------|-------------|
| VID-01 | Video player carga | Mux player debe renderizar correctamente | Abrir capítulo con video |
| VID-02 | Progreso de video se guarda | Posición de video debe persistir | Ver parcialmente, recargar, verificar posición |
| VID-03 | Capítulos gratuitos accesibles sin pago | Preview chapters deben ser reproducibles | Acceder sin compra a capítulo preview |

### Criterios de Éxito
- ✅ Mux player funciona sin errores
- ✅ Progreso se persiste correctamente
- ✅ Capítulos preview son accesibles sin autenticación

---

## Notas de Implementación

### Cobertura de Pruebas
- **Unit Tests:** 25 tests en src/ (componentes y páginas clave)
- **E2E Tests:** Playwright configurado con fixtures para student/instructor/admin
- **Integration Tests:** 1 test de integración (Navbar)

### Herramientas
- **Unit Testing:** Vitest + React Testing Library + MSW
- **E2E Testing:** Playwright
- **Linting:** ESLint con TypeScript
- **Build:** Vite

### Estado Actual
- ✅ Build exitoso (785.91 KB gzipped)
- ⚠️ Unit tests tienen fallos relacionados con matchMedia mock
- ⚠️ 40 ESLint issues (27 errores, 13 warnings) - principalmente @typescript-eslint/no-explicit-any
- ⚠️ 4 vulnerabilidades npm (3 moderate, 1 high) - fixables con npm audit fix

---

## Próximos Pasos

1. **Corregir tests unitarios** - Agregar mock de matchMedia en test setup
2. **Ejecutar E2E tests** - Validar flujos críticos con Playwright
3. **Resolver ESLint issues** - Principalmente tipado explícito de any
4. **Actualizar dependencias** - npm audit fix para vulnerabilidades

---

_Documento generado para evaluación de release v3.9.0_
