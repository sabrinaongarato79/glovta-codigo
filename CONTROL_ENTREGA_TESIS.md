# Glovta · Control de entrega y aceptación

[Matriz de observaciones de clase, validación y demo de 30 minutos](docs/DEFENSA_NEGOCIO_Y_DEMO.md). El acta puede remitir a la calculadora editable de costos y a sus fuentes. Pendientes importes pagados y consumo de proveedores, validación con compradores y registro de prueba integrada en web y teléfono. Los casos secuenciales de evaluación se distinguen de la carga concurrente y del uso de clientes reales.

## Ruta crítica vigente para la versión del martes 10

| Prioridad | Acción y esfuerzo orientativo | Dependencia | Evidencia para cerrar |
|---|---|---|---|
| P0 | Preparar fuentes locales reproducibles, 1 h | Equipo local | Commit recuperable, dependencias instalables y regresión en una copia independiente |
| P0 | Acordar alcance web y móvil, 1 h más respuesta | Sabrina y tutor | Decisión escrita por función o fase, con plataforma y exclusiones |
| P0 | Probar publicación y seguimiento en Supabase, 3–6 h con QA listo | Identificar QA, empresa habilitada, candidato y cuenta ajena | Registro de publicación, envío único, estado tras reingresar y acceso ajeno denegado |
| P0 | Validar APK en teléfono, 1–3 h para el flujo actual | Teléfono de Sabrina, cable de datos, compilación apuntando al mismo QA que la web | Perfil recuperado en ambos clientes y sesión cerrada; registrar versión y dispositivo |
| P1 | Completar manuales y videos, 3–6 h | Flujo integrado estable, prueba física | Dos grabaciones y capturas correspondientes a la versión candidata |
| P0 | Completar accesos y PL03, 2–4 h tras fijar versión | Autorización de publicación y roles acordados | Otra persona abre portal, APK, repositorios y demos y puede ingresar |
| P2 | Ensayar defensa, 1–2 h | Versión y material estabilizados | Ensayo cronometrado de 30 minutos con evidencia de respaldo |

Viernes 6: fuentes y entorno. Sábado 7: Android y alcance. Domingo 8: calidad. Lunes 9: carpeta académica y grabación. Martes 10: decisión de cierre según los criterios de aceptación. Miércoles 11: controles y correcciones finales. Las horas estiman trabajo activo y excluyen respuestas de terceros.

La [auditoría de cierre acelerado](docs/AUDITORIA_CIERRE_6_NOV.md) actualiza el diagnóstico para el viernes 6 y el sábado 7. Los catorce rubros están en el borrador. Los rubros 11 a 14 requieren videos, descarga, acceso público a la versión funcional, fuentes correspondientes y usuarios de evaluación. La verificación del 6/11 reemplaza el 404 histórico del repositorio de presentación: el repositorio con punto final responde 200. La ruta del portal en Vercel sigue devolviendo 404.

## Plan de cierre intensivo · viernes 6 a miércoles 11 de noviembre

| Cuándo | Responsable y tarea | Evidencia para cerrar |
|---|---|---|
| Vie 6, desde las 10 | Sabrina identifica el proyecto de evaluación y contrasta las plataformas exigidas con la devolución docente. Equipo técnico comprueba destino, membresías y configuración antes de cualquier escritura. | Referencia de QA distinta de producción y alcance por plataforma identificado. Si falta QA, seguir con Android y documentación. |
| Sáb 7 | Equipo técnico y Sabrina ensayan empresa y candidato con cuentas independientes en el entorno habilitado. | Oferta identificable, reingreso con estado conservado, duplicado rechazado y operación ajena denegada. Conservar informe sin credenciales. |
| Dom 8 | Sabrina instala la misma APK registrada en su teléfono. Equipo técnico guía y registra dispositivo, versión y resultado. | Guardar un titular ficticio en la web de evaluación y recuperarlo desde la misma cuenta en Android; comprobar error de red y cierre de sesión. Confirmar primero que ambos clientes apuntan a QA. |
| Lun 9 | Corregir hallazgos y repetir recorridos. Revisar teclado, zoom, lector y TalkBack. Actualizar manuales y grabar solo sobre recorridos aprobados. | Resultado por caso; capturas y dos videos reproducibles. Incidencias críticas vuelven a desarrollo. |
| Mar 10 | Fijar versión candidata. Contrastar las 13 funciones y las seis historias de fase 1 con tutoría. Revisar los 14 rubros y PL03; ensayar 30 minutos. | Versión, huella APK, datos institucionales y lista de enlaces contrastados por otra persona. Cualquier pendiente sigue visible. |
| Mié 11 | Verificación final desde navegador limpio y teléfono. Repetir regresión y pruebas afectadas por correcciones. | Registro final con versión exacta, rol, fecha, esperado/obtenido y decisión para entrega. |

### Prioridades de aceptación

P0: alcance acordado, empleo real con Auth y aislamiento, APK en dispositivo, privacidad y accesos del tribunal. P1: manuales, videos, diagramas consistentes con el software y PDF/PL03 con enlaces utilizables. P2: material comercial y ensayo de preguntas. El trabajo comercial puede avanzar mientras se espera un dispositivo o el entorno de evaluación.

Manual web para tutoría: [guía con capturas](docs/MANUAL_WEB.md). Manual móvil: [pasos de la APK](docs/MANUAL_ANDROID.md), pendiente de capturas del teléfono. Preservar los originales institucionales.

### Investigación y decisiones comerciales

En Descargas se recuperaron GLOCKTA_01_Entrevistas_Cualitativas.pdf, GLOCKTA_02_SCAMPER.pdf y GLOCKTA_05_Alcance_Validacion_FODA.pdf. El primero contiene fichas sobre orientación, presentación de experiencia y seguimiento; para citar testimonios ante la mesa, confirmar método, fecha y procedencia con la autora. SCAMPER propone sustituir el CV estático por una ficha reutilizable y combinar búsqueda y formación. El documento de alcance describe funciones futuras y una arquitectura propuesta con Firebase; la documentación técnica del producto debe referirse al código integrado con Supabase. Queda por conciliar el alcance académico y verificar instrumentos y respuestas originales de encuestas.

## Corte de revisión del 6 de noviembre

El PDF principal en `output/pdf/GLOVTA_Entrega_para_revision.pdf` organiza los catorce rubros, con índice interactivo, diagramas de trabajo y Gantt. La matriz `MATRIZ_ALCANCE.md` vincula cada fila de la propuesta original con plataforma, historia, prueba y brecha. La nueva prueba de Passport extenso recuperó 32 de 32 títulos en cuatro páginas. El APK fue compilado y firmado para depuración. Sigue pendiente instalar esta compilación en un teléfono.

Antes de enviar el PL03: validar con el tutor el alcance por plataforma, completar los manuales ilustrados, formalizar UML/DER con cardinalidades y contrastarlos con la versión entregada, comprobar los roles en evaluación, grabar ambas demos y verificar las URL de descarga, portal y repositorios desde una sesión externa. Confirmar datos de portada y fecha real. La plantilla editable está en `docs/PL03_Glovta_borrador.docx`.

Procedimiento de los documentos institucionales v2025.05: una persona envía el PDF desde su correo institucional a coordinacion.as@davinci.edu.ar, con copia al resto si corresponde. Incorporar las correcciones del tutor. Con su aprobación para presentar los entregables, solicitar fecha a alumnos@davinci.edu.ar. Confirmar con Coordinación la vigencia de la modalidad y las fechas.

Fuente institucional: Entregables v2025.05, sección 3. PL03 v2026.01 agrega el registro de materiales, accesos y usuarios. Los dos PDF de pasos tienen el mismo SHA-256. El temario de la carrera sirve para explicar aportes académicos. Los lenguajes y motores que enumera requieren confirmación aparte si se pretende tratarlos como condiciones del proyecto.

El PDF de entrega debe tener rótulo, índice y páginas numeradas. Los enlaces deben ser específicos y tener nombres claros. Esta matriz conserva el orden institucional para preparar ese PDF.

| N.º | Entregable | Criterio de aceptación y estado |
| --- | --- | --- |
| 1 | Presentación | Portada con logo institucional, imagen de Glovta, mes, año, integrantes y correos institucionales confirmados. Pendiente confirmar datos del grupo. |
| 2 | Acta del proyecto | Público, uso previsto, objetivos medibles, alcance, límites, tecnologías, mercado, comparación y responsables. La propuesta comercial debe distinguir hipótesis de precios, costos y demanda de resultados medidos. Consolidación pendiente. |
| 3 | Requisitos | Separar Web y APK. Identificar cada requisito, actor, resultado observable y prueba. Agregar requisitos no funcionales de seguridad, accesibilidad, rendimiento y recuperación. Validar contra la versión a entregar. |
| 4 | Casos de uso | Diagrama UML y fichas con actor, precondición, flujo, excepciones y resultado. Vincular con requisitos. |
| 5 | Casos de prueba | Ocho pruebas locales de API aprobadas con Supabase simulado. Falta ejecutar web y Android contra un entorno de evaluación y registrar evidencia. |
| 6 | DER | Tomar la migración SQL como base. Confirmar claves, cardinalidades y políticas en la base desplegada. |
| 7 | Clases | Modelar entidades y relaciones del código que se entrega. Distinguir el modelo conceptual de las clases implementadas. |
| 8 | Arquitectura | Mostrar cliente web, cliente Android, API y base con límites de confianza, autenticación y despliegue. Verificar cada conexión. |
| 9 | Componentes | Identificar interfaces y dependencias entre clientes, autenticación, perfiles, oportunidades y postulaciones. |
| 10 | Gantt | Fechas, responsables, dependencias y entregables. Distinguir avance real de planificación. |
| 11 | Demo Web y APK | Publicar videos separados, con audio y texto legibles. Usar la misma versión que instalará el tribunal. Pendiente grabar y probar enlaces. |
| 12 | APK y fuente | Descargar desde un enlace específico, instalar en un Android limpio y probar inicio, login y recorrido. Verificar repositorio y versión del binario. APK todavía sin verificar. |
| 13 | Website y fuente | La presentación de Vercel respondió HTTP 200. Falta identificar y probar la web funcional vinculada a su repositorio. El enlace GitHub compartido devolvió 404 desde el acceso disponible. |
| 14 | Usuarios por rol | Probar credenciales de evaluación en ambos clientes y comprobar permisos permitidos y denegados. Compartir cuentas de prueba mediante la entrega institucional. |

## Material PL03 y defensa

**Actualización del 6 de noviembre.** Para el punto 5, hay 23 regresiones aprobadas y 13 comprobaciones previas en Supabase sobre perfiles. La empleabilidad suma seis grupos de pruebas en PostgreSQL real local con cuentas separadas. Para los puntos 6, 8 y 9 se agregó el vínculo de titularidad de ofertas y el circuito de estados en `docs/EMPLEABILIDAD_EVALUACION.md`. Para los puntos 11, 13 y 14 sigue pendiente repetir el recorrido web en Supabase de evaluación, verificar roles y grabar la versión del tribunal. Registrar instalación y recorrido móvil antes de grabar el video Android.

- Preparar un manual Web y un manual APK con acceso, requisitos, recorrido por rol y solución de fallas frecuentes, usando capturas de la versión entregada.
- Crear enlaces con nombres distintos para instalación Android, código Android, acceso web, código web, demo Android y demo web. Abrirlos desde una sesión limpia con los permisos del tribunal.
- La defensa incluye propuesta comercial, demo en vivo y participación activa de todo el grupo. Usar el guion de 30 minutos y ensayar el pase de Web a APK.
- Evaluar cualquier función de IA con datos ficticios, casos de error y supervisión. Registrar qué datos utiliza, qué decisión ayuda a tomar y cómo se comprueba el resultado.

## Prueba de salida

En Web y APK, verificar por rol los flujos acordados, la persistencia al volver a entrar, los errores de red, la sesión vencida y la denegación de accesos ajenos. Registrar versión, entorno, pasos, resultado esperado, resultado observado y evidencia. Repetir las pruebas después de corregir fallas críticas y antes de grabar los videos. El dominio propio queda para después de validar la entrega.

## Corte verificable del 6/11: candidato para revisión

Evidencia y límites en [la auditoría de excelencia](GLOVTA_AUDITORIA_EXCELENCIA_FINAL.md). Regresión 23/23; cuatro consultas anónimas denegadas en Supabase; siete grupos SQL locales aprobados. APK instalado y abierto en emulador API 36, todavía sin prueba autenticada física. Vercel: portada HTTP 200, portal HTTP 404. Pendientes la evaluación integrada con identidades QA, accesos externos, videos y decisión de alcance. Este corte no autoriza publicar.

## Evidencia del 7/11/2026

- Preparación QA revisada y prevalidación de cuentas/rol añadida antes de generar datos.
- Recorrido empresarial local con API simulada: aprobado; cero excepciones JavaScript; informe output/qa/empresa-web-local.json, capturas output/qa/empresa-local/empresa-aceptada.png y candidata-reingreso.png.
- Bloqueo de evaluación real: falta clave publicable QA en .env.qa y entrada local de contraseñas. Rol empresarial aún no confirmado remotamente.
- No contabilizar este ensayo como prueba de las 27 políticas RLS, persistencia Supabase ni Android. Producción no modificada. 404 público pendiente de publicación autorizada de una versión verificada.
