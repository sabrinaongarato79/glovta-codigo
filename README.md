# GLOVTA — Global Knowledge & Talent Accelerator

Plataforma de empleabilidad inclusiva: una persona organiza su trayectoria en un perfil profesional (su *Career Passport*), busca oportunidades, se postula y sigue el estado de cada postulación; una empresa habilitada publica búsquedas y resuelve las postulaciones.

Proyecto de Seminario Final — Analista de Sistemas, Escuela Da Vinci. Autora: Sabrina Beatriz Maria Ongarato.
Nombre de trabajo; la denominación definitiva figura en el PL03.

## Estado de verificación

| Elemento | Estado | Evidencia |
|---|---|---|
| Web + API Express + Supabase Auth + PostgreSQL con RLS | Implementado | Código en este repositorio |
| Circuito empresa → oferta → postulación → revisión → aceptación → reingreso | Probado en el entorno de evaluación (camino principal) | `evidencias/recorrido-web-2026-11-15/` |
| Pruebas automáticas (`npm test`) | 23 pruebas con Supabase **simulado**; última ejecución registrada el 12/11/2026 | No acreditan la base remota |
| Trayectoria y aislamiento entre cuentas | 13 comprobaciones aprobadas el 12/11/2026 | No equivalen a auditar las 27 políticas RLS |
| Casos negativos de seguridad del circuito de empleo | **Pendientes** | — |
| Android | Compilada la APK `0.1.0-qa`; pruebas en teléfono declaradas | `evidencias/android-a22-2026-11-14/` |
| Portal público | Responde (comprobación HTTP sin sesión); falta el recorrido autenticado desde otra red | `evidencias/despliegue-2026-11-14/` |
| Conformidad WCAG | **No declarada**: hay comprobaciones parciales | — |

Lo que no está implementado no se presenta como tal: no hay IA, pagos, mentorías, formación ni notificaciones.

## Qué hace cada plataforma

**Web (`portal.html`)**: registro e ingreso, perfil, trayectoria (experiencia, formación, idiomas y habilidades), Career Passport, oportunidades, postulaciones y panel de empresa (publicar y resolver postulaciones, cuando el módulo está habilitado).

**Android (nativo, Java)**: iniciar sesión, **consultar el perfil propio** y cerrar sesión. No edita el perfil, ni lista ofertas, ni permite postular: eso se hace en la web.

**Sitio de presentación (`index.html`)**: demostración con datos guardados en el navegador. No envía formularios ni procesa pagos.

## Arquitectura

```
Navegador (HTML/CSS/JS)  ─┐
                          ├─►  API Node.js + Express 5  ─►  Supabase Auth + PostgreSQL (RLS)
Android (Java nativo)  ───┘        (clave publicable + JWT del usuario)
```

- La API crea un cliente de Supabase por solicitud con la clave **publicable** y el token del usuario, de modo que las políticas RLS se aplican. No se usa `service_role` en la web, la API ni la APK.
- Base de datos: 8 tablas y 27 políticas por fila en `supabase/migrations/` (3 migraciones). La transición de estado de una postulación (enviada → en revisión → aceptada o rechazada) la valida un disparador de la base.
- Sin ORM, sin framework de frontend, sin Firebase.

## Estructura

| Carpeta o archivo | Contenido |
|---|---|
| `server/` | API Express (autenticación, perfil, oportunidades, postulaciones, empresa) |
| `index.html`, `app.js`, `styles.css` | Sitio de presentación |
| `portal.html`, `portal.js`, `portal.css` | Portal funcional |
| `supabase/migrations/` | Esquema, restricciones y políticas RLS |
| `android/` | Aplicación Android nativa |
| `scripts/` | Verificaciones, arranque de evaluación, paquete de despliegue y compilación de la APK QA |
| `test/` | Pruebas automáticas |
| `docs/` | Manuales, plan, estado y borradores de entrega |
| `evidencias/` | Evidencias de las pruebas |

## Requisitos
Node.js 22.14 o superior. Para Android: Android Studio y Gradle (el proyecto usa AGP 8.9.2, minSdk 26).

## Instalación y ejecución local

```bash
npm ci
npm test
```

**Importante — a qué proyecto se conecta.** `npm start` lee el archivo local `.env`, que **no se versiona** y puede apuntar a otro proyecto (incluso al de producción). Para el entorno de evaluación usá:

```bash
# Requiere un .env.qa local con la URL del proyecto de evaluación y la clave PUBLICABLE
node scripts/start-qa.mjs
# → http://127.0.0.1:8081/portal.html
```

`scripts/start-qa.mjs` ignora la configuración heredada y rechaza el proyecto de producción. El único proyecto autorizado para pruebas es `yecgzorcxkokanuxgwki`.

Variables de entorno (solo nombres): `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `GLOVTA_EMPLOYER_ENABLED`, `PORT`, `HOST`. El módulo de empresa se activa solamente con `GLOVTA_EMPLOYER_ENABLED=true`.

## Publicación de evaluación
`node scripts/prepare-evaluation-deploy.mjs` arma un paquete con una lista explícita de archivos (sin `.env`, sin datos), un adaptador `api/index.js` y un `vercel.json`. El adaptador responde 503 si la URL de Supabase no es la del proyecto de evaluación o si la clave no es publicable. `node scripts/verify-deployment-package.mjs` lo comprueba localmente.

## Android
`node scripts/build-android-qa.mjs` genera la APK de evaluación `0.1.0-qa`. La compilación solo acepta la URL del proyecto de evaluación y una clave publicable. Detalles de uso y prueba: `docs/MANUAL_ANDROID.md` y `docs/PRUEBA_ANDROID_EVALUACION.md`. Que compile no acredita que funcione: la prueba en teléfono se registra aparte.

## Seguridad
- No se versionan `.env*` (salvo `.env.example`), APK ni claves.
- Solo se usa la clave publicable de Supabase.
- No hay contraseñas de cuentas de evaluación en este repositorio; se entregan por un medio restringido.
- Las políticas RLS están activas, pero eso no prueba por sí solo el aislamiento: los casos negativos están en preparación.

## Limitaciones conocidas
- Android no tiene todas las funciones de la web (decisión de alcance pendiente de confirmación docente).
- Según la lectura de las políticas, un usuario con rol de empresa podría postularse a su propia oferta; falta una prueba que lo confirme.
- El estado «retirada» existe en el esquema pero ninguna acción lleva a él.
- Faltan cabeceras de seguridad HTTP (CSP, etc.) en la API.

## Documentación
`docs/MANUAL_WEB.md`, `docs/MANUAL_ANDROID.md`, `docs/PREPARAR_QA.md`, `docs/CIERRE_PRIORIZADO_2026-11-14.md` y `GLOVTA_HANDOFF.md` (estado del trabajo y pendientes).
