# GLOVTA: primera etapa de persistencia

Estado: esquema preparado, NO ejecutado ni conectado. No equivale a backend terminado.

## Alcance

- Perfil privado vinculado a Supabase Auth.
- Lectura pública de oportunidades publicadas y vigentes.
- Postulación de la propia cuenta con restricción de duplicados.
- Sin permisos de administración autoasignables desde el navegador.
- La carga inicial de oportunidades corresponde a administración confiable.
- Roles de empresa, lectura de candidatos por empresas, retiro de postulaciones,
  agenda, cursos y pagos siguen pendientes.

## Preparación del proyecto

1. Crear un proyecto nuevo GLOVTA en https://supabase.com/dashboard.
2. Conservar la contraseña de base de datos en un gestor de contraseñas.
3. Antes de aplicar el SQL, confirmar que sea un proyecto nuevo y sin tablas del mismo nombre.
4. Aplicar `migrations/202609300001_mvp_core.sql` una sola vez mediante SQL Editor.
5. Configurar Auth con la URL pública de GLOVTA y redirecciones explícitas.
6. La interfaz usará URL del proyecto y clave publicable. Nunca usar service_role o
   claves secretas en HTML, JavaScript público o GitHub.
7. Conectar registro, sesión y formulario de perfil después de verificar los permisos.

## Validación pendiente en Supabase

Crear dos cuentas de prueba A y B y probar mediante sus sesiones (no únicamente
desde SQL Editor, que puede tener privilegios administrativos):

- Un visitante ve oportunidades vigentes, pero no perfiles ni postulaciones.
- A crea y modifica su perfil; B no puede leerlo ni modificarlo.
- A no puede crear una postulación como B.
- A puede postularse a una oportunidad publicada y vigente; no a borradores o vencidas.
- Un segundo envío a la misma oportunidad falla sin duplicar el registro.
- A no puede fijar el estado de una postulación como aceptada.
- B no puede consultar las postulaciones de A.
- El perfil y las postulaciones continúan disponibles al iniciar sesión en otro navegador.

No publicar el flujo como funcional hasta completar estas pruebas y sus estados de error.

Fuentes de diseño:
https://supabase.com/docs/guides/database/postgres/row-level-security
https://supabase.com/docs/guides/auth/managing-user-data
