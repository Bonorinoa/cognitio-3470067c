# Release Checklist - Cognitio v3.9.0

**Versión:** v3.9.0  
**Fecha Target:** Enero 2026  
**Tipo de Release:** Stable / Release Candidate

---

## Pre-Release Verification

### 1. Código y Calidad

- [x] **Build exitoso** - `npm run build` completa sin errores (785.91 KB gzipped)
- [ ] **Tests unitarios pasan** - `npm run test` (actualmente con issues de matchMedia mock)
- [ ] **ESLint limpio** - `npm run lint` (40 issues actuales, no críticos)
- [x] **TypeScript compila** - Sin errores de tipo bloqueantes
- [ ] **E2E tests pasan** - `npm run test:e2e` (pendiente ejecución completa)

**Acción Requerida:**
```bash
# Fix unit test mocks
# Resolver ESLint issues críticos (opcional para v3.9.0)
# Ejecutar E2E tests completos
```

---

### 2. Seguridad

- [x] **No secrets hardcodeados** - Verificado con grep
- [x] **Variables de entorno correctas** - Solo VITE_ prefix en cliente
- [x] **`.env` en `.gitignore`** - Confirmado
- [x] **RLS policies habilitadas** - Verificado en schema
- [ ] **npm audit** - 4 vulnerabilidades menores (3 moderate, 1 high)
- [ ] **CodeQL scan** - Pendiente ejecución para v3.9.0

**Acción Requerida:**
```bash
npm audit fix
# O ejecutar npm audit fix --force si hay breaking changes
```

---

### 3. Documentación

- [ ] **README.md actualizado** - Actualizar a v3.9.0 (actualmente v3.5.0)
- [ ] **DEVELOPMENT_PLAN.md actualizado** - Marcar v3.9 como completo, reorganizar v3.10+
- [x] **CHANGELOG.md actualizado** - v3.9.0 ya documentado
- [x] **E2E_TEST_PLAN.md creado** - ✅ Completado
- [x] **SECURITY_AUDIT.md creado** - ✅ Completado
- [x] **RELEASE_CHECKLIST.md creado** - ✅ Este documento

**Acción Requerida:**
```bash
# Actualizar README.md (mantener español)
# Actualizar DEVELOPMENT_PLAN.md (mantener español)
```

---

### 4. Features v3.9.0

Verificar que todas las features de v3.9.0 están completas:

- [x] **AI Studio Dashboard** - Landing page en `/ai-studio`
  - [x] Quick actions cards (Blog, Newsletter coming soon)
  - [x] Recent generations display
  - [x] 4 analytics cards funcionando
  
- [x] **`is_active` Column** - Soft-delete en `ai_generation_history`
  - [x] Migración de base de datos aplicada
  - [x] Index para performance creado
  
- [x] **Usage Tracking Fix** - Cuenta correcta independiente de historial
  - [x] `useGenerationUsage` cuenta ALL registros today
  - [x] `useGenerationHistory` usa soft-delete

- [x] **Routing actualizado** - Dashboard como primera opción
  - [x] `/ai-studio` → Dashboard
  - [x] `/ai-studio/knowledge` → Knowledge Base
  - [x] `/ai-studio/blog` → Blog Generator

---

### 5. Regresiones

Verificar que features anteriores siguen funcionando:

**Core Platform (v1.0 - v2.9)**
- [ ] Autenticación (login/signup/forgot password)
- [ ] Catálogo de cursos (filtros, búsqueda, visibilidad)
- [ ] Dashboard estudiante (cursos comprados + membresías)
- [ ] Dashboard instructor (analytics, métricas)
- [ ] Stripe checkout y webhooks
- [ ] Mux video playback
- [ ] Progreso de curso

**AI Studio (v3.0 - v3.8)**
- [ ] Knowledge Base CRUD
- [ ] Style Profiles
- [ ] Blog Generator con streaming
- [ ] Content refinement
- [ ] Generation history (save/load/delete)
- [ ] Export MD/TXT
- [ ] Mobile tab bar
- [ ] Daily usage limits (10/day)

---

### 6. Compatibilidad

- [x] **Node.js 18+** - Verificado en package.json engines (si aplica)
- [x] **Navegadores modernos** - Chrome, Firefox, Safari, Edge últimas versiones
- [x] **Mobile responsive** - Diseño funciona en 320px - 1920px
- [ ] **Supabase compatible** - Verificar que migraciones están aplicadas

**Acción Requerida:**
```bash
# Verificar que migraciones de DB están aplicadas en producción
# Especialmente tabla ai_generation_history con columna is_active
```

---

### 7. Performance

- [x] **Bundle size aceptable** - 785.91 KB gzipped (advertencia: algunos chunks >500KB)
- [ ] **Lighthouse Score** - Pendiente verificación
- [ ] **Core Web Vitals** - Pendiente medición
- [x] **Loading states** - Skeletons implementados

**Nota:** Bundle size grande es conocido. Considerar code-splitting en v4.0.

---

### 8. Internacionalización

- [x] **Español (default)** - Todas las strings traducidas
- [x] **Inglés (opcional)** - Soporte completo con i18next
- [x] **Toggle de idioma** - Funcional en navbar
- [x] **AI Studio español** - Nuevas features en español

---

## Release Steps

### Fase 1: Pre-Deploy Checklist

```bash
# 1. Actualizar documentación
# Editar README.md → v3.9.0
# Editar DEVELOPMENT_PLAN.md → marcar v3.9 completo

# 2. Resolver vulnerabilidades
npm audit fix

# 3. Actualizar browserslist
npx update-browserslist-db@latest

# 4. Build final
npm run build

# 5. Verificar dist/
ls -lh dist/
```

### Fase 2: Deploy

**Con Lovable:**
1. Abrir [Lovable](https://lovable.dev)
2. Share → Publish
3. Verificar deployment exitoso

**Manualmente:**
```bash
# Build
npm run build

# Deploy a hosting (Vercel/Netlify/etc)
# Subir contenido de dist/

# Configurar variables de entorno:
VITE_SUPABASE_PROJECT_ID=hlnvfkturjctxbiikfoe
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbG...
VITE_SUPABASE_URL=https://hlnvfkturjctxbiikfoe.supabase.co
```

### Fase 3: Post-Deploy Verification

**Smoke Tests (5 min):**
- [ ] Landing page carga correctamente
- [ ] Login funciona
- [ ] Catálogo de cursos muestra cursos
- [ ] Dashboard estudiante accesible
- [ ] Dashboard instructor accesible
- [ ] AI Studio Dashboard carga
- [ ] Generar un blog (verificar límite diario)

**Full E2E (30 min):**
- [ ] Ejecutar todos los tests de E2E_TEST_PLAN.md
- [ ] Verificar cada sección (UI/UX, Auth, Catalog, etc.)

---

## Rollback Plan

Si se detectan problemas críticos post-deploy:

```bash
# Opción 1: Rollback en plataforma de hosting
# Vercel: Rollback en dashboard
# Netlify: Deploy previous version

# Opción 2: Revert commit y re-deploy
git revert HEAD
git push origin main
npm run build
# Re-deploy
```

**Criterios para Rollback:**
- Sistema de auth no funciona
- Pagos con Stripe fallan
- Video playback no funciona
- AI Studio genera errores críticos
- RLS leak de datos entre usuarios

---

## Post-Release

### Monitoring (Primera Semana)

- [ ] Monitorear logs de Supabase para errores
- [ ] Verificar webhooks de Stripe procesando correctamente
- [ ] Revisar métricas de uso de AI Studio
- [ ] Recopilar feedback de usuarios beta
- [ ] Verificar métricas de performance

### Quick Wins (v3.9.1)

Si se encuentran bugs menores, crear v3.9.1:
- [ ] Fix test mocks (matchMedia)
- [ ] Resolver ESLint issues
- [ ] Optimizaciones de bundle size (si necesario)
- [ ] Mejoras de UX basadas en feedback

---

## Decisión: Stable vs Release Candidate

### ✅ Criterios para v3.9.0 **Stable**
- [x] Todas las features v3.9 completas
- [x] Build exitoso sin errores
- [x] Seguridad: 0 vulnerabilidades críticas
- [ ] Tests E2E completos pasan
- [ ] Smoke tests en producción exitosos

### ⚠️ Criterios para v3.9.0-rc.1 **Release Candidate**
- [x] Features completas pero con tests pendientes
- [ ] Vulnerabilidades menores sin resolver
- [ ] Requiere validación adicional por usuarios beta

**Recomendación Actual:** 
- **v3.9.0-rc.1** si se lanza HOY sin resolver tests/vulnerabilidades
- **v3.9.0 stable** después de:
  1. Resolver npm audit issues
  2. Confirmar E2E tests pasan
  3. Smoke tests exitosos en staging/producción

---

## Comunicación

### Changelog Público (para usuarios)

```markdown
# Cognitio v3.9.0 - AI Studio Dashboard

## 🚀 Nuevas Funcionalidades

### AI Studio Dashboard
- Nuevo landing page en AI Studio con vista general de tu actividad
- Acciones rápidas para generar contenido
- Estadísticas de uso de documentos y generaciones
- Historial reciente de generaciones con carga rápida

### Mejoras de Sistema
- Tracking mejorado de uso diario de generaciones
- Soft-delete para historial (mejor gestión de datos)
- Navegación optimizada en AI Studio
- Performance mejorada en carga de historial

## 🐛 Correcciones
- Bug en contador de uso cuando historial alcanza límite
- Mejoras en precisión de métricas de AI Studio

## 📚 Documentación
- Nueva guía de pruebas E2E
- Auditoría de seguridad completa
- Checklist de release actualizada

---

Ver CHANGELOG.md para detalles técnicos completos.
```

### Internal Notes
- v3.9.0 completa el core de AI Studio (Blog Generator)
- Newsletter Generator (v3.10) se mueve a roadmap futuro
- v4.0 comenzará con features de scaling (enrollment, notifications)

---

## Sign-off

**Product Owner:** [ ] Aprobado  
**Tech Lead:** [ ] Aprobado  
**QA:** [ ] Tests completados  
**Security:** [x] Auditoría aprobada  
**Documentation:** [ ] Actualizada  

**Final Decision:** [ ] GO / [ ] NO-GO

**Release Date:** _______________

**Released By:** _______________

---

_Checklist creado: Enero 2, 2026_
