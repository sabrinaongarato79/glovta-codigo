# Auditoría de Glovta y plan de desarrollo
Fecha de revisión 4 de noviembre de 2026

## Alcance y conclusión
Revisión del proyecto local en Documents/ChatGPT/Glovta y contraste con el resumen de clase aportado, PL03 y las pautas institucionales previamente leídas. Se inspeccionaron estructura, archivos de configuración, API, SQL, almacenamiento web y cliente Android. Esta revisión no acredita el estado de las bases remotas ni la equivalencia del checkout con GitHub o los despliegues.

Glovta tiene una demostración web local, una API parcial y una APK inicial compilada. Completar la autenticación compartida y los permisos constituye el primer requisito para demostrar un recorrido integrado. Durante esta etapa se produce documentación y se ejecutan pruebas existentes, sin modificar código.

## Arquitectura identificada
- Web con HTML, CSS y JavaScript. storage.js guarda datos en localStorage. app.js contiene catálogo y oportunidades de ejemplo y agenda local.
- API Node.js 22, Express 5 y cliente Supabase. Expone salud, oportunidades, perfil propio y postulaciones.
- Migración PostgreSQL para Supabase con profiles, opportunities y applications. Incluye claves foráneas, unicidad de postulación y políticas RLS. Ejecución remota sin acreditar.
- Android nativo Java, Gradle 8.11.1, plugin Android 8.9.2, compileSdk 35, targetSdk 34 y minSdk 26. Pantalla principal y AuthClient. Usa HTTPS directamente contra autenticación Supabase.
- Configuración local sin archivo .env. Android toma URL y clave pública desde variables del entorno de compilación. Deben documentarse y validarse también cuando se compila desde el IDE.
- Firebase no aparece integrado en esta copia inspeccionada. Se propone mantener Supabase por la API y migración existentes, sujeto a validar la infraestructura real.

## Matriz funcional
| Función | Evidencia | Estado y brecha |
| --- | --- | --- |
| Registro y recuperación | Sin flujo identificado en clientes | Pendiente |
| Login Android | AuthClient verifica respuesta y presencia de token | Parcial. Descarta el token, sin sesión, renovación o cierre de sesión |
| Login web | app.js opera con almacenamiento local | Integración pendiente |
| Personas, empresas y administración | RLS de propietario y oportunidades publicadas | Faltan membresías de empresa, permisos de publicación y administración |
| Career Passport | Perfil local web y API de perfil propio | Falta integración web y pantalla móvil |
| Habilidades, experiencia y formación | Esquema de perfil limitado a nombre, titular, ubicación y biografía | Falta modelo y edición estructurada |
| Oportunidades | Ejemplos web y GET de API | Falta publicación por empresa y clientes conectados |
| Postulaciones | API y restricción única en SQL | Falta recorrido en ambos clientes y verificación remota |
| Asesorías | Reserva en navegador | Falta asignación, confirmación, seguimiento y cierre |
| Cursos | Catálogo y carrito demo | Falta definir alcance de seguimiento formativo |
| Administración | admin.html muestra datos locales | Falta autenticación y gestión autorizada del sistema compartido |
| Accesibilidad | Etiquetas y mensajes Android, estilos web | Falta prueba con lector, teclado, escala de texto y contraste de cada pantalla |
| IA | Porcentajes fijos de coincidencia en ejemplos web | Falta función de IA comprobable y criterios de evaluación |
| APK | Binario debug generado y primera pantalla abierta previamente | Login nuevo sin validación integral, faltan módulos y distribución final |

## Problemas y riesgos
1. Prioridad crítica para la entrega. Los clientes aún no completan el ciclo autenticación, perfil y postulación sobre una misma base.
2. Prioridad alta. La autorización real de empresas y administradores está pendiente. El panel demo público no equivale a administración protegida. Mantener datos de prueba en esa pantalla hasta implementar controles de servidor.
3. Prioridad alta. La sesión Android se descarta. Es necesario un contrato de sesión, expiración, renovación, cierre y protección de credenciales antes de conectar módulos privados.
4. Prioridad alta. El checkout local está sin commits y sin remoto. GitHub existe con el nombre glovta-presentacion. incluyendo el punto final. Comparar contenido e historial antes de vincular o publicar. Crear commits a partir de cambios reales, sin reconstruir fechas ficticias.
5. Compatibilidad Android. MainActivity usa setAccessibilityHeading, disponible desde API 28, mientras minSdk es 26. Añadir compatibilidad o revisar versión mínima antes de afirmar cobertura.
6. Operación. Faltan métricas de disponibilidad, copias de seguridad, restauración, monitoreo, límites de uso y prueba de fallas de red.
7. Dependencias. Las versiones y el lockfile existen. No se realizó en esta revisión un análisis completo de vulnerabilidades transitivas, por lo que no se acredita ausencia de vulnerabilidades.
8. Evidencia. Compilar la APK y aprobar pruebas con base simulada no acredita integración remota, permisos ni usabilidad.
9. Identidad. El resumen usa Global Knowledge and Talent Accelerator y la web Global Vision Talent Accelerators. Confirmar expansión del nombre antes de unificar materiales.

## Matriz documental
| Entregable | Material encontrado | Trabajo requerido |
| --- | --- | --- |
| Acta y plan | Diagnósticos y análisis locales | Consolidar alcance, objetivos medibles, responsables y límites |
| Requisitos funcionales y no funcionales | Material previo y control de entrega | Archivos independientes con IDs, prioridades y aceptación medible |
| Casos de uso | Pendientes de consolidación | Diagrama y fichas por rol ligados a requisitos |
| Casos de prueba | test/backend.test.js y reportes QA previos | Matriz requisito-prueba, entorno, versión y evidencia de web y Android |
| DER | Migración SQL | Diagrama consistente con esquema desplegado |
| Clases y UML | Sin entrega final verificada | Modelos fieles al código y responsabilidades |
| Arquitectura y componentes | Documentación técnica previa | Diagramas de cliente, API, autenticación, datos y despliegue |
| Gantt | Sin calendario final validado | Fechas, responsables, dependencias y avance real |
| Manual web y manual móvil | Sin manuales finales verificados | Dos documentos con capturas y recorridos de la versión entregada |
| API | Rutas implementadas | Contrato, códigos de error, autenticación y ejemplos sin secretos |
| Videos | Guiones y presentaciones | Dos videos reales y enlaces comprobados |
| Web y repositorios | URLs conocidas y GitHub accesible anteriormente | Validar acceso limpio, correspondencia de versión y fuente Android |
| APK | Binario debug local | Instalación limpia, versión identificable y descarga accesible |
| Cuentas por rol | Sin evidencia completa | Cuentas de evaluación y pruebas positivas y negativas |
| Negocio y defensa | Guiones existentes | Flujo comercial de asesoría, costos, precios hipotéticos y ensayo por integrante |

Mantener el PDF índice en el orden de los 14 puntos institucionales e incluir enlaces a documentos independientes solicitados en clase. Preparar estructura documental con requisitos, casos, diagramas, manuales, pruebas, negocio y defensa. Publicar cada archivo solamente después de validar su contenido.

## MVP propuesto y prioridades
P0, antes de ampliar funciones. Congelar especificación del recorrido, auditar diferencia con GitHub, validar Supabase, crear esquema y cuentas de evaluación, implementar autenticación y autorización compartidas. Aceptación: cada rol accede a lo permitido y recibe rechazo al intentar operar sobre datos ajenos.

P1, núcleo funcional. Persona edita perfil, consulta oportunidad y se postula desde web y Android. Empresa publica y revisa postulaciones propias. Administrador gestiona la publicación según reglas definidas. Aceptación: persistencia al volver a entrar, duplicados controlados y permisos comprobados.

P2, asesorías y formación. Implementar solicitud, asignación y confirmación, prestación y cierre con estados visibles. Catálogo de formación con alcance definido. Aceptación: cada solicitud tiene responsable y próximo paso identificable.

P3, IA acotada. Proponer orientación sobre habilidades a partir de información autorizada, con revisión humana, indicadores de limitación y control de costos. Aceptación: casos evaluados, errores controlados y ausencia de decisiones automáticas de contratación.

P4, entrega y defensa. APK instalable, documentación de versión, videos y links por recurso. Ensayo con recuperación ante caída de red y preguntas técnicas. Mantener pagos y LinkedIn como evolución salvo requisito confirmado.

## Calendario propuesto sujeto al avance
- 4 a 6 de noviembre. Especificación, repositorios, configuración y permisos.
- 7 a 12 de noviembre. Autenticación y recorrido integrado en ambos clientes.
- 13 a 16 de noviembre. Roles, regresiones, manuales, evidencias y videos de versión.
- 17 de noviembre. Ensayo y revisión de enlaces.
- 18 de noviembre. Presentación ante Seminario Final, fecha comunicada por la estudiante.
- 19 a 25 de noviembre. Correcciones y consulta administrativa de mesa.
- Fin de noviembre. Completar paquete validado por tutor.
- Diciembre. Regresión, ensayo y preparación para la posible defensa del 18 de diciembre, según habilitación institucional.

Las fechas de desarrollo son objetivos de planificación. Si el núcleo no supera las pruebas, ajustar alcance con el tutor y registrar pendientes.

## Negocio y comprensión para la defensa
Propuesta a validar: acceso gratuito para perfiles y consulta de oportunidades; asesoría con precio por servicio; herramientas de empresas con suscripción. Estimar demanda, costo por asesoría, infraestructura, soporte y margen con supuestos explícitos y cotizaciones verificadas. Cada asesoría necesita responsable, disponibilidad, confirmación, política de cancelación y resultado entregable.

Cada integrante debe explicar una regla de negocio, una decisión arquitectónica, un control de seguridad y una prueba ejecutada. Documentar el uso de IA en el desarrollo y revisar personalmente sus resultados.

## Preparación de mesa
- [ ] Confirmar duración. Pauta institucional previa: 30 minutos de presentación, 20 de preguntas y 10 de deliberación. Resumen nuevo: aproximadamente 40 minutos totales.
- [ ] Confirmar fecha oficial, condiciones administrativas e integrantes.
- [ ] Requisitos vinculados con implementación, pruebas y documentos.
- [ ] Web y Android operativos con roles verificados.
- [ ] APK descargable e instalada en dispositivo limpio.
- [ ] Repositorios con historial real y accesibilidad comprobada.
- [ ] PDF índice y archivos individuales con enlaces específicos.
- [ ] Manuales y videos coherentes con la versión final.
- [ ] Cuentas de evaluación comunicadas por el canal institucional.
- [ ] Restauración y alternativa de demostración ensayadas.
- [ ] Exposición técnica y comercial practicada por cada integrante.
