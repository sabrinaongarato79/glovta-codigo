# Career Passport de Glovta

En el portal local, iniciá sesión. **Mi espacio** muestra los datos guardados y dos indicadores. La presentación inicial cuenta nombre, titular, ubicación y resumen. El perfil profesional suma objetivo, trayectoria, idiomas y habilidades. Cada uno de los ocho criterios tiene el mismo peso. Para acreditar trayectoria alcanza con formación, proyectos, voluntariado o empleo. El total queda pendiente si falta cargar una sección.

En **Mi perfil**, elegí una de las seis secciones, editá y guardá. **Career Passport** presenta la información guardada y permite imprimirla. **Oportunidades** permite filtrar publicaciones y consultar las postulaciones propias. El correo de acceso queda fuera de la presentación exportable.

Las cuatro secciones de trayectoria se cargan desde la API del portal. Cada tarjeta conduce a su editor y refleja los registros que devuelve el servidor después de guardar o eliminar. Si la carga falla, la tarjeta permite llegar al control de reintento. Los proyectos personales, académicos y de voluntariado pueden registrarse como experiencia.

**Imprimir o guardar PDF** abre el diálogo de impresión del navegador. La hoja muestra la presentación que se ve en pantalla y la trayectoria cargada. Antes de compartirla, guardá los cambios y comprobá que todas las secciones hayan cargado.

## Evidencia

- La suite de Node pasó sus 23 pruebas.
- En Edge a 390, 768 y 1280 píxeles, la prueba de secciones verificó alta, modificación, eliminación, recarga tras iniciar sesión de nuevo, conservación de borradores de otra sección, reintento ante error, limpieza al salir y ausencia de desborde horizontal. También verificó que la hoja de impresión incluya el Passport y oculte el editor.
- Las capturas completas usan datos ficticios entregados por una API de prueba. El código comercial obtiene los registros de la API autenticada.
- El reporte previo de Supabase en `output/qa/rls-real.json` documenta las pruebas con dos cuentas. La modificación visual conserva los endpoints y políticas.
- Pendientes de aceptación: recorrer la interfaz local con una cuenta real después del rediseño, revisar el PDF generado con un perfil largo y probar navegación por teclado y lector de pantalla antes de declarar conformidad WCAG.
