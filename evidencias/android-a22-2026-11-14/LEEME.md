# Evidencia Android — pruebas del 14/11/2026

Copia de archivos que Codex generó durante las pruebas en el teléfono (carpeta `tmp/`, no versionada). Se conservan acá para que no se pierdan.

## Qué son
- 13 volcados de pantalla `glovta-*.xml` (estructura de la interfaz, con hora de modificación 14/11/2026 entre 19:41 y 20:36).
- 1 captura: `talkback-close.png` (14/11, 19:57).

## Qué muestran (leído de los textos de los volcados)
- Pantalla de acceso con "INICIAR SESIÓN", "Correo electrónico" y "Contraseña".
- Mensaje ante clave incorrecta: «Revisá tu correo y contraseña.»
- Mensaje ante falla de red: «No se pudo conectar. Revisá tu conexión e intentá nuevamente.»
- Pantalla de perfil con el botón "CERRAR SESIÓN" y el texto «Validacion web Android QA».

## Qué NO acreditan por sí solos
- Qué dispositivo se usó, ni la versión exacta de la APK instalada. Los volcados no registran SHA-256 ni commit.
- Que TalkBack haya leído todos los controles: solo hay una captura de "Cerrar sesión".
- Rendimiento, cierres inesperados ni compatibilidad con otros equipos.

Estado: DECLARADO por Codex y consistente con estos archivos; falta registrar dispositivo, versión y SHA-256 de la APK instalada.

## APK revisada (14/11/2026 en la computadora)
Archivo `Glovta-evaluacion-0.1.0-qa.apk` (no versionado por `.gitignore`): 14.941 bytes, SHA-256 `04f70b97eac770d162fa65b2947cceaf93fbf999044795d095f32fb86ec01a8a`.
Dentro de la APK: solo el proyecto de evaluación `yecgzorcxkokanuxgwki`, solo clave de tipo `sb_publishable_` y sin `service_role` (revisado 15/11/2026).

## Datos
Los correos que aparecen son cuentas ficticias de evaluación (`@example.com`). No hay contraseñas.
