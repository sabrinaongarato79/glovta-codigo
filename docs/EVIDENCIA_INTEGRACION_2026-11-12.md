# Integración real de Glovta en evaluación

Ejecución del 12/11/2026. Entorno autorizado: glovta-evaluacion, referencia yecgzorcxkokanuxgwki. Cuentas ficticias de empresa y candidata. Esta evidencia no corresponde a producción.

## Resultados verificados

- La consola de ejecución acredita autenticación de ambas cuentas y prevalidación de roles diferenciados.
- `output/qa/rls-evaluacion.json`: estado passed, 13 comprobaciones aprobadas. Incluyen cuentas distintas y, para experiencias, educación, idiomas y habilidades, CRUD, persistencia y aislamiento entre cuentas, además de bloqueo anónimo.
- `output/qa/empresa-web-evaluacion.json`: resultado aprobado, referencia de evaluación confirmada y cero excepciones JavaScript. Fecha del informe: 12/11/2026 a las 19:27:48 de Argentina (22:27:48 UTC).
- El script del recorrido web usa API Express local conectada a Supabase de evaluación, sin interceptar respuestas en ese modo. Comprueba publicación de una oferta, postulación de candidata, revisión, aceptación y visualización del estado aceptado tras cerrar sesión y volver a ingresar como candidata.
- Capturas generadas: `output/qa/empresa-evaluacion/empresa-aceptada.png` y `output/qa/empresa-evaluacion/candidata-reingreso.png`.

## Alcance y límites

Las 13 comprobaciones no equivalen a una auditoría individual de las 27 políticas RLS. El bloqueo visual de postulación duplicada no acredita por sí mismo el rechazo de duplicados directamente en base de datos. El recorrido no acredita rechazo de postulaciones ni todas las transiciones posibles.

El campo limite del informe empresarial incluye una advertencia genérica sobre simulación local. En esta ejecución, modo y ref identifican evaluación real y el código solo intercepta respuestas cuando no existe QA_STAGE_REF. Se conserva el informe original sin alterarlo.

Quedan pendientes: integración autenticada desde Android, acceso al portal público y resolución del 404, cobertura de seguridad fuera de los casos ejecutados, accesibilidad y actualización integral del PL03 y manuales. No declarar estos pendientes como aprobados basándose en la ejecución web local.

No es necesario repetir esta ejecución aprobada sin un cambio relevante o un fallo nuevo. Conservar informes y capturas para la entrega académica.
