# Prueba de Android en evaluación

Proyecto: Glovta — Global Knowledge & Talent Accelerator.
Fecha de preparación: 12/11/2026. Cierre interno: 16/11/2026. Presentación prevista: 18/11/2026.

## Versión y alcance

La compilación reproducible se ejecuta desde la raíz con `node scripts/build-android-qa.mjs`. Lee únicamente la configuración Supabase de `.env.qa`, exige el proyecto yecgzorcxkokanuxgwki y una clave publicable. No requiere contraseñas de usuarios ni claves administrativas.

Salida esperada tras compilación y lint aprobados: `output/android-evaluacion/Glovta-evaluacion-0.1.0-qa.apk`. Identificador: `com.glovta.app.evaluacion`. Nombre visible: Glovta Evaluación. Versión: 0.1.0-qa, código 1. Android mínimo: 8.0 (API 26). Es una APK de depuración para evaluación, no un lanzamiento de tienda.

La implementación actual permite autenticación, consulta de nombre, titular, ubicación y presentación del perfil propio, y salida a la pantalla de acceso. No guarda tokens en disco ni restaura una sesión al reiniciar. Ofertas, postulaciones y gestión empresarial se demuestran en la web; no deben figurar como funcionalidades móviles terminadas. El cierre de sesión actual descarta la vista y credenciales en memoria; no acredita revocación remota de tokens.

## Recorrido en teléfono físico

Usar únicamente las cuentas ficticias de evaluación. No enviar contraseñas ni claves por chat, capturas o videos.

1. Registrar modelo de teléfono, versión Android, fecha, versión APK y SHA-256 del informe de compilación.
2. Instalar la APK verificada y abrir Glovta Evaluación. Registrar una captura de la pantalla inicial.
3. Probar un correo inválido y una contraseña vacía. Deben aparecer mensajes comprensibles, sin cerrar la app.
4. Ingresar como candidata con su contraseña guardada. Comparar el perfil con la misma cuenta en el portal web conectado a QA.
5. Guardar en la web un titular ficticio identificable, por ejemplo “Perfil QA Android — 12 de noviembre”. Salir y volver a ingresar en Android. Verificar coincidencia exacta y tomar captura sin credenciales.
6. Cerrar sesión. Debe reaparecer el formulario y no mostrarse el perfil anterior. Volver a ingresar y comprobar los datos.
7. Salir e ingresar como empresa. Verificar que no se muestra el perfil de la candidata. Esto comprueba el recorrido visible, no sustituye una prueba directa de autorización de perfiles ajenos.
8. En la pantalla de acceso, desactivar temporalmente la conexión e intentar ingresar. Debe aparecer un error controlado y permitir reintentar. Restaurar la conexión y verificar recuperación.
9. Probar rotación, texto ampliado y TalkBack. Registrar legibilidad, orden del foco, etiquetas y acceso a botones. No declarar conformidad WCAG a partir de esta prueba breve.
10. Guardar el resultado de cada paso como PASS, FAIL o NOT RUN, con evidencia y observaciones.

## Estado inicial

La prueba física y el acceso autenticado Android están NOT RUN hasta recibir evidencia. Un emulador o una compilación correcta no reemplazan esa verificación.

## Instalación por USB

Con autorización del dispositivo y depuración USB habilitada, comprobar primero `adb devices -l`. Debe figurar el teléfono como device, no unauthorized. Seleccionar su número de serie explícitamente al instalar:

```text
adb -s NUMERO_DE_SERIE install -r RUTA_ABSOLUTA_AL_APK
```

No desinstalar una app existente para resolver conflictos sin revisar primero si contiene datos que se deban conservar. El identificador QA separado permite distinguir esta instalación de com.glovta.app.
