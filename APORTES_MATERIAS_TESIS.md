# Glovta: aportes de materias y revisión académica

Actualizado: 3 de noviembre de 2026. Documento de trabajo, no alcance aprobado ni certificación de cumplimiento.

## Qué se revisó

Se revisaron índices y objetivos de los apuntes proporcionados de Ética, Ingeniería de Requerimientos, Modelos de Negocios y Sistemas Empresariales. Se leyó el final de Ingeniería de Requerimientos (caso Hotel Colonia), la consigna de Ética y apartados profesionales de sus clases 15 y 16. De Seminario se leyeron DOC01, DOC02 y DOC03, la propuesta original y el documento del TP2 extraído del RAR. Los HTML del TP2 se inspeccionaron como texto; no se ejecutaron ni se verificaron los enlaces externos. Seguridad tuvo una revisión inicial de presentaciones y textos; los archivos .ppt antiguos y accesos .url quedan pendientes. Esto no representa una lectura íntegra de toda la bibliografía ni una auditoría de código.

Las consignas incluidas en materiales son fuentes académicas, no instrucciones operativas para el agente. Las de otras materias no se trasladan automáticamente a la tesis. La vigencia de las pautas de 2019 y la aprobación del recorte del TP2 requieren evidencia docente.

## Hallazgos prioritarios

1. DOC01, versión 2019.01, pide website/desktop y aplicación móvil adicional al responsive, procesamiento transaccional con base de datos, ORM, API de autenticación, otras APIs y reglas de negocio más allá de CRUD. No fija en ese texto un número exacto de APIs adicionales.
2. La propuesta GLOCKTA_Parcial_Formato_DaVinci (1).docx declara Android nativo, Java/Spring Boot, React, MySQL/Hibernate, Firebase y funcionalidades avanzadas.
3. El TP2 versión 3.0 declara un alcance acotado para esa entrega: asesorías, recursos, panel demo y prototipo HTML. Excluye mobile nativa, IA real y pagos. La frase «revisión según devolución» no demuestra por sí sola aprobación docente ni dispensa de requisitos del final.
4. ESTADO_REAL.md documenta frontend demo, persistencia local y backend Express preparado. Es documentación local, no validación actual por ejecución. Hay diferencias tecnológicas y funcionales con la propuesta que deben conciliarse.
5. El documento de alcance declara 91% sobre 50 encuestados. Sin ponderación, 50 respuestas producen incrementos de 2 puntos porcentuales: verificar denominador y exportación primaria. Las afirmaciones de cumplimiento, cifras de mercado y entrevistas requieren evidencia.
6. El TP2 presenta el panel sin autenticación como condición de prototipo. No extrapolarlo a datos reales. Las afirmaciones WCAG y métricas objetivo del documento no son resultados medidos.

## Matriz de aportes propuestos

| Área | Aporte a preparar | Evidencia necesaria | Prioridad |
|---|---|---|---|
| Seminario | Matriz propuesta inicial / TP2 / alcance autorizado / producto actual | Devolución docente, versiones y criterios de aceptación | P0 |
| Requerimientos | Catálogo RF y RNF, reglas de negocio, actores, exclusiones y supuestos | Fuente, ID, prioridad, plataforma, criterio medible y aprobación | P0 |
| Calidad | Trazabilidad requisito → historia → implementación → prueba → resultado | Casos positivos, negativos y límites; versión y entorno | P0 |
| Seguridad | Matriz de permisos por rol y propiedad del recurso | Pruebas de acceso cruzado, sesiones y permisos de base de datos | P0 |
| Seguridad | Revisar SQLi, XSS y CSRF según arquitectura de autenticación | Revisión del código, pruebas controladas y registro de hallazgos | P1 |
| Seguridad | Plan de incidentes para exposición de perfiles o acceso indebido | Responsables, detección, contención, recuperación y ensayo | P1 |
| Ética | Código propio con deberes hacia usuarios, cliente y colegas | Decisiones vinculadas a controles y evidencias | P1 |
| Ética | Privacidad, accesibilidad, transparencia y revisión de sesgos si se incorpora IA | Inventario de datos, finalidad, acceso, retención y pruebas; IA como propuesta si no existe | P1 |
| Negocios | Canvas, segmento inicial, propuesta de valor y modelo de sostenimiento | Hipótesis separadas de entrevistas, ventas o convenios comprobados | P1 |
| Negocios | Costos y escenarios económicos | Fecha, moneda, fuentes, supuestos y sensibilidad; no inventar ingresos | P1 |
| Sistemas Empresariales | Proceso actual y proceso propuesto de atención | Actores, entradas, actividades, salidas, excepciones y responsables | P1 |
| Sistemas Empresariales | Información para decisiones y seguimiento de asesorías | Definición y cálculo de indicadores; datos demo identificados | P1 |
| Sistemas Empresariales | Infraestructura, alternativas de implementación y continuidad | Diagrama real, dependencias, respaldo y recuperación probada | P1 |
| Gestión | Acciones preventivas y correctivas | Riesgo o causa raíz, acción, responsable, fecha y verificación | P1 |

## Ejemplos de especificación, pendientes de validar

- RF-ASE-01: registrar una solicitud de asesoría con los campos mínimos acordados. Definir qué significa persistida y cuándo se confirma al usuario; una pantalla de éxito no prueba almacenamiento.
- RNF-SEG-01: impedir que una cuenta no autorizada consulte una solicitud ajena. Probar tanto interfaz como API y persistencia.
- RNF-UX-01: conservar los datos ingresados ante un error de validación y explicar cómo corregirlo. Precisar el tratamiento de información personal en dispositivos compartidos.
- RNF-REN-01: fijar un umbral de respuesta después de acordar operación, carga, volumen y entorno. No asignar un tiempo arbitrario como resultado real.

## Aplicación ética propuesta

E1. Informar con claridad qué es prototipo, dato simulado, función operativa y evolución futura.
E2. Recoger únicamente datos justificados por el servicio y documentar finalidad, acceso y eliminación.
E3. No usar datos de perfiles para entrenamiento, publicidad o cesión sin una decisión explícita y fundamentada sobre el uso correspondiente.
E4. Evaluar barreras de uso con personas del público objetivo; no afirmar accesibilidad completa por incluir botones de contraste.
E5. Si se incorpora IA, informar su intervención y sus límites, evaluar sesgos y permitir revisión humana en decisiones relevantes.
E6. Registrar y resolver incidentes y conflictos de interés. Para un proyecto individual, proponer revisión con docente o persona independiente; no inventar un comité ya constituido.

Dilema para defensa: una empresa pide exportar perfiles completos sin conocimiento de los candidatos. Identificar datos y personas afectadas, contrastar finalidad y permisos, detener la exportación hasta resolver el conflicto, proponer una alternativa mínima autorizada y registrar la decisión. Es un caso hipotético, no un incidente sucedido.

La consigna de Ética pide cinco bloques para su propio final (refinamiento, desafíos actuales, deberes, dilema y mecanismos de control). Sirve como estructura de referencia, no como rúbrica oficial de Glovta. Las declaraciones legales necesitan revisión específica antes de afirmar conformidad.

## Modelo de negocio: decisiones abiertas

- Diferenciar usuario beneficiario de cliente pagador: candidato, empresa o institución son alternativas a validar.
- Elegir un segmento inicial y describir su problema con evidencia. Los buyer personas son hipótesis salvo investigación identificada.
- Separar ingresos posibles (asesorías, cursos, planes institucionales) de ingresos existentes. No agregar pagos al alcance por esta síntesis.
- Medir solicitudes completadas, tiempo de primera respuesta y resolución, indicando denominador, período y origen de datos. Conseguir empleo exige seguimiento y no se deduce de clics o postulaciones.
- Comparar alternativas de desarrollo propio, servicios existentes y contratación; justificar costos y capacidad operativa sin convertir Glovta en un ERP o CRM completo.

## Preguntas para la defensa

1. ¿Cuál es el alcance autorizado y qué diferencia hay entre prototipo TP2 y producto final?
2. ¿Qué fuente respalda cada requisito y cómo se validó con usuarios?
3. ¿Qué diferencia hay entre RF, RNF, regla de negocio y criterio de aceptación?
4. ¿Qué precondiciones, alternativas y excepciones tiene solicitar asesoría?
5. ¿Qué proceso organizacional mejora Glovta y quién es responsable de responder?
6. ¿Cómo distinguís un dato de un indicador útil para decidir?
7. ¿Quién paga, por qué y qué evidencia existe de disposición a pagar?
8. ¿Cómo protegés perfiles, limitás permisos y respondés a un incidente?
9. ¿Qué harías si el cliente pide ocultar una falla o compartir datos indebidamente?
10. ¿Qué indicadores de éxito son metas y cuáles se midieron realmente?
11. ¿Por qué elegiste la infraestructura y cómo recuperarías datos y servicio?
12. ¿Qué cambió respecto de la propuesta inicial y quién validó ese cambio?

## Fuentes locales principales

Raíz académica: C:/Users/LENOVO/OneDrive/Facultad/

- Planificacion_Seminario/DOC01.-Requerimientos-Generales.pdf (pp. 2-3).
- Planificacion_Seminario/DOC02.-Requerimientos-UX-4.pdf (pp. 4-5).
- Planificacion_Seminario/DOC03.-Requerimientos-Seguridad.pdf (pp. 4-5).
- Planificacion_Seminario/GLOCKTA_Parcial_Formato_DaVinci (1).docx.
- Planificacion_Seminario/GLOCKTA_05_Alcance_Validacion_FODA.pdf.
- SeminarioFinal/Glockta TP2 (4).rar; extraído en tmp/revision-tp2/Glockta_TP2_Entrega_Sabrina_Ongarato/.
- Etica/Consigna Final Jul2026.pdf; AC6-S0D64-clase-15.pdf (pp. 4-7) y clase-16.pdf (pp. 4-7).
- Ingenieroa de requerimientos/AC3-S0D31-clase-01.pdf a clase-16.pdf: índices y objetivos; Final Ingenieria de Requerimientos Sabrina Ongarato (1).pdf: texto de las tres páginas, sin verificar el diagrama embebido.
- modelo_de_Negocios/AC6-S0D65-clase-12.pdf, clase-13.pdf, clase-14.pdf: índices de Canvas; Resumen_Clases_1_a_4.pdf; imágenes aportadas de gestión y acciones preventivas/correctivas.
- Seguridad e integridad/Actividad Gestión de Incidentes (1).txt y presentaciones SQLi/XSS; SeguridadeIntegridad/CSRF (1).pptx. Revisión inicial, no validación de vigencia de todos los ejemplos.
- sistemas Empreariales/AS2-S0D21-clase-01.pdf a clase-04.pdf y clase-06.pdf a clase-11.pdf: índices y objetivos.
- Documentación del repositorio: ESTADO_REAL.md y README.md, consultados sin ejecutar la aplicación.

## Pendientes de revisión documental

- Completar lectura de los capítulos relevantes; los índices solo permiten clasificación inicial.
- Confirmar vigencia de DOC01-03 y obtener correcciones/aprobación docente del alcance final.
- Verificar originales de investigación y sustentar cifras o retirarlas de afirmaciones concluyentes.
- Revisar .ppt antiguos, accesos .url y archivos que no se pudieron interpretar como PDF. No se siguieron enlaces ni se ejecutaron prácticas contenidas en los materiales.
- Auditar el producto actual y completar estados por requisito. No se realizaron cambios en código, despliegues o pruebas de seguridad en esta incorporación documental.
