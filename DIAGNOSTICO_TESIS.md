# Glovta: diagnóstico y plan para máxima preparación

Fecha: 3 de noviembre de 2026.

## Resultado

El proyecto de este checkout todavía no está listo para acreditar todos los entregables de tesis. No se asigna porcentaje de cumplimiento: faltan validaciones funcionales, documentación y evidencia mobile. Máxima preparación es el objetivo; la calificación corresponde al tribunal.

## Fuentes y alcance de la revisión

- Downloads/Entregables.pdf y Tesis - Entregables_260819_202742.pdf: texto completo, versión 2025.05; mismo listado textual de entregables.
- Downloads/Pasos para Presentacion de Tesis.pdf: texto completo, versión 2025.05.
- Downloads/PL03_ENTREGA (1).docx: plantilla de enlaces vacía, versión 2026.01. Complementa el listado; no contiene aprobación ni accesos cumplimentados.
- Apuntes tesis/AC6-S0D61: clasificación mediante índices y objetivos; desafíos 01-11 mediante texto extraído. No se confunde un ejercicio de clase con requisito de habilitación de mesa.
- Downloads/GLOVTA_Codex_Paquete_Final_v2/05_CALIDAD_SEGURIDAD/DEFENSA_TESIS.md: leído completo; no se auditó íntegramente el resto de ese paquete.
- Código revisado: server/app.js, test/backend.test.js, migración SQL; búsquedas en app.js. README y ESTADO_REAL son fuentes auxiliares, no prueba de ejecución remota.
- No se inspeccionaron visualmente todos los documentos ni diagramas, ni se verificaron enlaces remotos. No se ejecutó auditoría integral de seguridad, accesibilidad o rendimiento.

## Evidencia ejecutada

Comando: runtime Node del entorno, `node --test` en el directorio del proyecto.
Resultado: 5 pruebas aprobadas, 0 fallidas.

Cubren salud local y 503 sin configuración; rechazo de cuerpos inválidos; rechazo de sesiones ausentes/inválidas; uso de identidad verificada al postular; tratamiento de errores simulados de base de datos sin filtrar detalles.

Límite: Supabase está sustituido por dobles de prueba. No acredita migración aplicada, RLS remoto, usuarios reales, interfaz integrada, APK, pagos ni IA.

## Bloqueantes y decisiones prioritarias

1. **Alcance académico:** conciliar propuesta inicial, recorte TP2 y alcance final aceptado. No inferir una dispensa de APK a partir del prototipo responsive del parcial.
2. **APK:** no se identificó proyecto Android ni instalador en el checkout inspeccionado. Determinar implementación mobile con alcance comparable y aceptación docente; no presentar la PWA como APK ya entregada.
3. **Persistencia y recorrido completo:** el frontend utiliza datos demo/localStorage; no se detectaron llamadas fetch en app.js. La API tiene rutas preparadas, pero falta evidencia de integración extremo a extremo y despliegue.
4. **ORM y tecnología:** la propuesta nombra Java/MySQL/Hibernate; el checkout contiene Express/Supabase. DOC01 pide ORM: no atribuir esa condición al cliente Supabase automáticamente. Documentar decisión y validar la alternativa académica.
5. **Roles:** el esquema inicial contempla perfil propio y postulaciones; empresa, mentor y administración requieren implementación y pruebas según alcance autorizado. El panel demo no acredita RBAC.
6. **Entrega y defensa:** reunir documentos, manuales, videos, repositorios, URLs y cuentas de evaluación; validar enlaces desde un entorno externo sin privilegios del propietario.
7. **Investigación:** verificar datos primarios de entrevistas/encuestas; revisar 91% sobre 50 respuestas y eliminar absolutos de mercado sin respaldo.
8. **Integraciones:** verificar autenticación y otras APIs exigidas, con errores controlados. No añadir integraciones comerciales para aparentar completitud.

## Checklist de entrega, en orden institucional

Estado «pendiente» significa no acreditado por esta revisión, no necesariamente inexistente en otras carpetas.

| # | Entregable 2025.05 | Estado y condición de cierre |
|---|---|---|
| 1 | Presentación | Pendiente de PDF final con logo institucional, imagen, identidad, correo institucional y fecha real |
| 2 | Acta | Hay propuestas divergentes; unificar público, uso, objetivo, alcance, límites, tecnología, mercado y responsabilidades |
| 3 | RF Website y APK | Parciales; IDs, plataforma, fuente y criterios comprobables |
| 4 | Casos de uso: diagrama y documentación | Pendiente de versión coherente con alcance y código |
| 5 | Casos de prueba | Cinco automatizados locales; ampliar a recorridos y registrar resultados y límites |
| 6 | DER | Migración con profiles, opportunities y applications; falta diagrama y validación contra base efectiva |
| 7 | Clases | Pendiente; modelar el diseño real sin inventar clases Java |
| 8 | Arquitectura | Preparar diagrama de componentes desplegados y distinguir futuro |
| 9 | Componentes | Pendiente de diagrama vinculado a módulos reales |
| 10 | Gantt | Pendiente de tareas, dependencias, responsables y fechas reales; no inventar historia de ejecución |
| 11 | Demo APK y Website | Prototipo previo identificado; falta evidencia audiovisual del producto final |
| 12 | Descarga APK y código fuente | No acreditados en checkout |
| 13 | Website hosteado y código fuente | URLs previas en TP2; no verificadas ni equivalentes a versión final |
| 14 | Usuarios de distintos roles | Pendiente de cuentas de evaluación y pruebas de permisos |

PL03 2026.01 agrega campos explícitos para manual APK, manual Web, RNF, UML, demos separadas y accesos. Completarla con enlaces reales; distribuir credenciales de evaluación por un medio restringido, no en repositorios públicos. No usar datos personales reales en la demo.

## Secuencia de trabajo

### A. Cerrar decisiones antes de expandir código

- Establecer alcance final contrastando correcciones docentes. Registrar función, plataforma, estado real y criterio.
- Resolver arquitectura/ORM y mobile. Mantener intactos prototipos anteriores como evidencia de evolución.
- Seleccionar flujo de negocio central: perfil/oferta/postulación o asesoría, según alcance aceptado; no mezclar ambos como si ya estuvieran completos.

### B. Completar producto verificable

- Integrar interfaz, autenticación, API y persistencia; comprobar lectura después de recargar y desde otra sesión autorizada.
- Implementar roles y reglas de negocio aceptadas. Probar denegación por propiedad y rol, no solo ocultamiento de botones.
- Completar APK y APIs exigidas. Documentar configuración reproducible sin secretos.
- Ensayar errores, caídas, duplicados y recuperación. Verificar RLS en base real de prueba.

### C. Cerrar calidad y documentación

- Trazabilidad RF/RNF → historia/caso de uso → componente → prueba → evidencia.
- Pruebas de interfaz, integración, permisos, accesibilidad y rendimiento con objetivos y entorno definidos antes de medir.
- Diagramas y manuales consistentes con versión final. Presupuesto con supuestos fechados y objetivos diferenciados de resultados.
- Reunir riesgos, ética y negocio sin convertir todos los apuntes de otras materias en anexos obligatorios.

### D. Entrega y ensayo

- PDF en orden institucional, numerado e indexado, y PL03 cumplimentada.
- Enlaces accesibles, APK descargable e instalable, datos y usuarios de evaluación.
- Ensayar demo comercial y técnica dentro de los 30 minutos previstos en la guía; preparar preguntas para los 20 minutos del tribunal. Los 10 restantes son deliberación, no exposición.
- La guía pide visto bueno del tutor respecto de entregables antes de solicitar mesa; no se enviaron mensajes ni solicitudes en esta revisión.

## Criterio de listo

Todos los entregables localizados y verificados; alcance y tecnología coherentes; Website y APK demostrables; funciones comprometidas probadas; hallazgos críticos resueltos; pendientes menores transparentes; validación del tutor respecto de la presentación de entregables. No equivale a nota garantizada.
