# Glovta de evaluación

## Crear el proyecto

1. Abrir el [panel de proyectos](https://supabase.com/dashboard/projects). Seleccionar la organización que muestra **Free**.
2. Pulsar **New project**. Escribir **glovta-evaluacion**, generar una contraseña de base exclusiva y guardarla en el gestor de contraseñas.
3. Elegir una región cercana a los evaluadores y comprobar el plan y el precio que muestra el panel. Si pide contratar, detenerse antes de confirmar.
4. Pulsar **Create new project**. Cuando figure **Healthy**, copiar el **Project ID** en Settings → General. Compararlo con el ID de producción. Incluso el proyecto independiente puede mostrar «Production» junto a su propia rama principal. Lo que identifica el entorno es su referencia.

El plan Free admite hasta dos proyectos activos y el precio publicado es USD 0. La elegibilidad depende de la cuota disponible en la cuenta. Un proyecto gratuito puede pausarse después de una semana inactivo. Revisar su disponibilidad antes del ensayo. [Precios de Supabase](https://supabase.com/pricing)

## Configuración técnica después de obtener el ID

- Aplicar en la base **vacía de evaluación** los tres archivos de `supabase/migrations` en orden de nombre. Verificar primero el proyecto seleccionado en el SQL Editor. Crear desde Authentication dos identidades sintéticas y confirmar sus correos de prueba. Vincular exclusivamente el UID de empresa a `employer_accounts` con una membresía de evaluación. Para comprobar aislamiento entre empresas, agregar otra empresa sintética.
- En la raíz del proyecto local crear `.env.qa` con `QA_STAGE_REF`, `SUPABASE_URL=https://<ref>.supabase.co` y `SUPABASE_PUBLISHABLE_KEY` de evaluación. Git excluye este archivo. Usar la clave **Publishable**. Ejecutar `node scripts/start-qa.mjs --check` y luego `node scripts/start-qa.mjs`. Abrir `http://127.0.0.1:8081/portal.html`. El lanzador comprueba la referencia y habilita la gestión de empresas para este servidor.
- Generar la APK de evaluación en un checkout separado con las mismas variables SUPABASE de QA en el proceso de Gradle. Android las incorpora al compilar. Conservar el APK base, identificar el nuevo archivo por SHA-256 y usar un dispositivo de evaluación. Guardar un titular de prueba en web, entrar con la misma candidata en Android y verificar que coincide tras cerrar y reabrir sesión.
- Seguir [el ensayo de empleabilidad](EMPLEABILIDAD_EVALUACION.md). Conservar ID de oferta, estado observado al reingresar y evidencia de rechazo por duplicado y acceso cruzado. Guardar resultados separados de las corridas simuladas.
- Para el 404 externo, probar una versión de evaluación que sirva tanto `/portal.html` como `/api/health` y el resto de la API Express. La portada pública por sí sola no acredita el portal. Revisar la propuesta de despliegue antes de autorizar su publicación. Después, una persona ajena al equipo debe completar el recorrido desde su dispositivo. Incorporar evidencia y enlaces al PL03.
