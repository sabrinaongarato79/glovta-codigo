# Glovta para Android

Esta versión de evaluación permite ingresar con la cuenta de Glovta y consultar la presentación profesional guardada en Supabase. Requiere Android 8.0 o posterior y conexión a internet.

1. Recibí el APK correspondiente a la versión de evaluación e instalalo en el dispositivo autorizado. Si usás el emulador del proyecto, abrí Android Studio, elegí el dispositivo y ejecutá el módulo **app**.
2. Abrí **Glovta**. Ingresá el correo y la contraseña de tu cuenta de evaluación. Tocá **Iniciar sesión** una sola vez y esperá el resultado.
3. Al ingresar, verás nombre, titular profesional, ubicación y presentación, según los datos guardados. Si todavía falta crear el perfil, la app te indica que completes la presentación en el portal web.
4. Para modificar esos datos, entrá en **Mi perfil** desde el portal web, elegí **Presentación** y guardá. Volvé a ingresar en Android para recuperar la versión actualizada.
5. Tocá **Cerrar sesión** para volver a la pantalla de acceso en el dispositivo.

Si aparece un aviso de contraseña incorrecta, verificá que usás la cuenta de Glovta. Si la red falla, recuperá la conexión y volvé a intentar. El catálogo de oportunidades, el envío de postulaciones y la revisión por empresa corresponden al recorrido web en esta versión.

## Evidencia para la entrega

El APK de depuración se genera con el módulo Gradle `:app:assembleDebug`. Para la aceptación definitiva se requiere registrar instalación, acceso, datos recuperados y salida en un teléfono de evaluación, además de verificar el enlace del binario con una sesión limpia.
