# Perfil profesional Glovta
## Cambio implementado
Se reorganiza portal.html con identidad existente, navegación interna, presentación, oportunidades, postulaciones y vista previa personal Career Passport. portal.css introduce superficies claras con marca azul marino y cian, foco visible y diseño a 390 y 1280 px. Se eligieron superficies claras para lectura de formularios. recuperar.html comparte estilos y requiere revisión de regresión visual.
El porcentaje mide únicamente presentación inicial: nombre, titular, ubicación y biografía. Cada texto no vacío después de trim aporta 25 puntos. Cambia con el borrador y el estado distingue cambios sin guardar. Experiencia formal no es requisito ni factor.
El guardado sigue utilizando PUT /api/profile y los cuatro campos existentes. El Passport usa textContent y refleja esos campos. No hay exportación PDF en esta etapa.
## Evidencia
Doce pruebas de API aprobadas. scripts/verify-profile.cjs prueba login simulado, carga de perfil, transición 100 a 75, guardado simulado y ausencia de desborde y errores JavaScript a 390 y 1280 px. Capturas en output/qa/profile-390.png y profile-1280.png. No equivalen a persistencia remota ni auditoría completa WCAG. Verificación visual realizada sobre ambas capturas.
## Ampliación necesaria
Experiencia estructurada, formación, competencias, idiomas y preferencias requieren persistencia adicional. Propuesta: tablas profile_experiences, profile_education y profile_languages con propietario ligado a auth.users; campos de objetivo, habilidades y preferencias ligados a profiles. Cada tabla requiere RLS por propietario, límites, claves e índices, validación de API y formularios con edición de registros.
Experiencia necesita puesto, organización, fechas, indicador de actualidad y logros. Formación necesita institución, tipo, título y fechas. Idiomas necesita idioma y nivel. Preferencias necesita modalidad, jornada, sectores y tipos de oportunidad.
La ampliación remota requiere autorización. El rediseño de presentación inicial está implementado; el perfil completo solicitado sigue pendiente. No asignar 100/100 ni conformidad WCAG AA completa a esta entrega.

## Entrada al producto
Se separó la presentación de acceso y el encabezado autenticado mediante access-layout y profile-heading. La portada pública existente permanece en /. El acceso explica tres acciones concretas, utiliza el logo y ofrece mostrar u ocultar contraseña con aria-pressed. La información sobre registro indica su estado pendiente.
La recuperación de contraseña existente permite cambiarla con un enlace válido; todavía no hay solicitud de correo desde el formulario. Siguen pendientes registro público, términos y privacidad revisados, traducciones y perfil ampliado.

## Objetivo y preferencias conectados
El formulario incluye career_goal, work_mode, work_schedule, sectors y opportunity_types. La API valida longitudes y valores permitidos y conserva campos opcionales omitidos por clientes anteriores. El guardado usa las políticas de propietario de profiles. Trece pruebas de API aprobaron con Supabase simulado. La persistencia remota de estos nuevos campos requiere prueba con la cuenta del usuario.
