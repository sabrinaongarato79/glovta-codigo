# Pruebas y correcciones de Glovta

Fecha: 3 de noviembre de 2026. Alcance: checkout local, web demo y API preparada.

## Resultado

- Backend: 8 pruebas aprobadas, 0 fallidas.
- Navegador Edge: 13 escenarios aprobados, 0 fallidos.
- Navegador Chrome: 13 escenarios aprobados, 0 fallidos.
- Total: 34 ejecuciones aprobadas. Los escenarios de navegador se repiten en ambos navegadores; no son 34 funcionalidades distintas.
- Sintaxis de app.js, storage.js, sw.js, server/app.js, server/index.js y scripts/verify-browser.cjs: correcta.
- Capturas de escritorio (1440×900) y móvil (390×844) inspeccionadas visualmente; comprobación adicional de ancho de página en tablet (768×1024).

No significa ausencia garantizada de defectos: describe los escenarios ejecutados sobre esta versión.

## Fallos corregidos

| Problema | Corrección | Evidencia |
|---|---|---|
| Almacenamiento bloqueado interrumpía la inicialización de la web | Lectura y escritura protegidas en storage.js | Escenario con SecurityError, carga del catálogo y administración |
| Escrituras fallidas interrumpían formularios | Mensaje de error y conservación de campos; confirmación solo tras escritura exitosa | Pruebas de permisos bloqueados y cuota agotada |
| Reservas permitían fechas pasadas | Validación de fecha real, horario permitido y momento futuro | Reserva válida, duplicada y pasada en un mismo escenario |
| Admin contaba valores inválidos como perfiles o registros | Validación de estructura y campos de registros; carrito depurado | Datos corruptos, null, números y objetos incompletos |
| Career Passport guardado no se recuperaba en los campos tras recargar | Restauración de campos de texto desde un perfil válido | Guardado, recarga y reapertura del diálogo |
| Envío por teclado podía omitir pasos del Passport | Envío anterior al paso final avanza el recorrido | Enter mantiene el diálogo sin persistir un perfil incompleto |

El Service Worker pasó de caché v8 a v9 e incluye storage.js. La limpieza se limita al prefijo de cachés de Glovta para preservar cachés ajenas. Se comprobó carga offline de Home y Admin y ausencia de rutas API en caché.

## Escenarios de navegador

1. Carga del catálogo y oportunidades, sin respuestas locales HTTP de error durante la carga inicial.
2. Búsqueda con coincidencia y mensaje para búsqueda vacía de resultados.
3. Carrito: agregar, no duplicar, persistir, calcular total y quitar.
4. Career Passport: validación, guardado y recuperación tras recarga.
5. Contacto y visualización en Admin: texto con HTML mostrado como texto, sin crear una imagen ejecutable.
6. Enter en el Passport sin guardado prematuro.
7. Agenda: persistencia, rechazo de duplicados y fecha pasada.
8. Almacenamiento bloqueado: web operativa, sin falsa confirmación y campos conservados.
9. Datos JSON y estructuras inválidas: web y Admin operativos, contadores válidos.
10. Cuota agotada: datos de contacto conservados y sin registro ficticio.
11. Menú móvil, apertura de sección, contraste persistente y ancho de página; en Chrome también se comprobó Admin con registros de prueba.
12. Service Worker y carga offline de Home y Admin; API excluida del caché.
13. Capturas y ancho de página en tablet.

Cada escenario captura excepciones JavaScript no controladas. Se utilizaron perfiles de navegador aislados y datos sintéticos, sin alterar los datos del navegador habitual.

## Backend

Además de las cinco pruebas existentes, se agregaron pruebas de JSON malformado y cargas excesivas, límites y propiedad del perfil durante actualización, y rechazo de postulaciones inválidas antes de acceder a la base.

La base y autenticación Supabase se simulan. Se valida el contrato del código local, no la infraestructura remota.

## Cómo repetir

1. Iniciar `node server/index.js` (por defecto http://127.0.0.1:8080).
2. Ejecutar `node --test` para backend.
3. Con Playwright disponible, ejecutar `node scripts/verify-browser.cjs` para Edge.
4. Para Chrome, establecer TEST_BROWSER=chrome y repetir el paso 3. TEST_BASE_URL permite otro origen local.

En este equipo se usó el runtime Node y Playwright incluidos en Codex. En PowerShell, antes del comando de navegador:

```powershell
$env:NODE_PATH = 'C:\Users\LENOVO\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules'
& 'C:\Users\LENOVO\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' scripts/verify-browser.cjs
```

El script necesita Edge o Chrome instalado. No modifica cuentas ni servicios externos.

## Evidencia guardada

- output/qa/browser-results.json: ejecución Edge aprobada.
- output/qa/browser-results-chrome.json: ejecución Chrome aprobada.
- output/qa/desktop.png y output/qa/mobile.png: capturas de la ejecución final.
- scripts/verify-browser.cjs: suite de navegador reutilizable.
- test/backend.test.js: suite local de API.

## Pendientes que estas pruebas no cubren

- Supabase conectado, migración aplicada y RLS real con varias cuentas.
- Flujo completo de autenticación, persistencia remota y roles empresariales.
- APK Android, instalación y recorridos mobile nativos.
- Pagos, IA, correo, Google Calendar y otras integraciones reales.
- Despliegue público, pruebas de carga y auditorías completas de accesibilidad y seguridad.

El Admin continúa siendo una demo local sin autenticación. No está listo para manejar datos reales. Las pruebas de ancho y teclado realizadas no constituyen certificación WCAG.
# Verificación de entrega de fuentes · 6 de noviembre de 2026

Sobre el commit local `29a0926` se ejecutó `git clone --no-local` en una carpeta temporal nueva, seguido de `npm ci --ignore-scripts --no-audit --no-fund` y `npm test`. Se instalaron 74 paquetes. Resultado: 23 pruebas aprobadas, cero fallidas y cero omitidas. El entorno privado, las propiedades locales del SDK, los archivos de firma, los compilados y los informes de ejecución se excluyen de la entrega de fuentes. Se revisaron los 59 archivos seleccionados contra los valores sensibles configurados en el entorno local y patrones de clave privada, tokens de GitHub y claves secretas de Supabase. Esta prueba cubre la reproducción de la regresión web/backend en el equipo de desarrollo. La instalación Android y el circuito con Supabase Auth de evaluación requieren sus propias comprobaciones.

