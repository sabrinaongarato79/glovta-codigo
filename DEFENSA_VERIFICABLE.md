# Guía de defensa ajustada a evidencia

Fecha: 3 de noviembre de 2026. Borrador para actualizar tras cada implementación.

## Qué puede afirmarse hoy

«Glovta es un proyecto de empleabilidad inclusiva. Este checkout contiene una demostración web con datos locales y una base de API Express para oportunidades, perfil propio y postulaciones. Ejecutamos cinco pruebas locales aprobadas; los accesos a Supabase están simulados en esas pruebas. La conexión real, los permisos en base de datos y el flujo integrado todavía necesitan validación.»

No leer esta descripción como estado de todos los paquetes que puedan existir fuera de este checkout.

## Afirmaciones que requieren corregirse en la guía anterior

| Afirmación del paquete externo | Forma defendible mientras falte evidencia |
|---|---|
| Supabase usa RLS | La migración define políticas RLS; falta evidencia de ejecución y pruebas remotas |
| El usuario puede comprar cursos y ebooks | El checkout web tiene carrito/checkout demo; no se acreditó compra real |
| El backend recalcula precios | No se identificó ruta de compra en server/app.js; no afirmarlo como función existente |
| Matching explicable y Learning Path | Presentarlos como propuesta o demo hasta identificar algoritmo, datos y pruebas |
| Login de evaluación | No se acreditó login integrado del frontend ni cuentas de tribunal |
| Las claves no viven en el navegador | Distinguir claves públicas de secretos; una afirmación global requiere auditoría completa |
| Modo demo ante fallas | La API devuelve 503 sin configuración y el frontend tiene demos; no se probó conmutación integrada ante fallas |
| Se construye con SDD | Solo afirmarlo si especificaciones, decisiones y validaciones trazan el proceso real |

## Preguntas críticas y respuesta honesta

- **¿La web responsive reemplaza la APK?** Los entregables recibidos distinguen Website y APK. El TP2 era un prototipo web; no demuestra dispensa de APK para el final.
- **¿Todo está probado?** No. Las cinco pruebas locales cubren comportamientos acotados con base simulada. Faltan pruebas del sistema conectado.
- **¿Por qué cambió el stack?** Hay diferencia entre propuesta y checkout; debe documentarse la decisión y validarse su adecuación, incluido el ORM.
- **¿Qué evidencia respalda inclusión?** Mostrar tareas y resultados concretos de pruebas de accesibilidad y usabilidad cuando estén disponibles; controles visuales solos no acreditan conformidad completa.
- **¿Qué garantiza empleo?** No prometer contratación. Diferenciar apoyo al proceso, postulaciones y resultados laborales medidos.
- **¿De dónde vienen encuestas y métricas?** Mostrar instrumento, exportación, muestra, fechas y cálculo; si no están disponibles, reconocer que la afirmación está pendiente de verificación.

## Guion propuesto de 30 minutos

1. Problema, usuarios y evidencia: 4 minutos.
2. Propuesta de valor y alcance autorizado: 3 minutos.
3. Demo funcional Website y APK: 13 minutos, solo después de completar ambas.
4. Arquitectura, datos y reglas de negocio: 4 minutos.
5. Calidad, seguridad y accesibilidad con evidencia: 4 minutos.
6. Resultados, límites y evolución: 2 minutos.

No presentar este guion como demo ya realizada. Preparar respaldo audiovisual, instalación y datos de prueba antes de la mesa.
