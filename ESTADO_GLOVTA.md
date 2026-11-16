# ESTADO GLOVTA — continuidad

Actualización del 6 de noviembre de 2026.

Se agregó ensayo local representativo de 20 ofertas y 40 postulaciones con aislamiento entre dos candidatos y dos empresas. PostgreSQL 18.6 aprobó siete grupos y completó el lote secuencial en 738 ms en esta ejecución. QA cloud y teléfono siguen pendientes. Calculadora de negocio en outputs/cierre-2026 y recorrido comercial en docs/DEFENSA_NEGOCIO_Y_DEMO.md.

**Último avance de cierre.** La primera versión local de fuentes es el commit `29a0926` (59 archivos). En una clonación nueva, sin configuración privada, se instalaron 74 dependencias y aprobaron 23/23 pruebas de regresión. Esto resuelve la falta de historial local identificada en la auditoría anterior. Sigue pendiente el acceso externo del tribunal y la prueba de empleabilidad en QA separado. La próxima intervención de Sabrina es identificar ese proyecto o confirmar que solo existe producción.

Auditoría acelerada del 6–7: [diagnóstico y ruta crítica](docs/AUDITORIA_CIERRE_6_NOV.md). Tras corregir el mensaje ante una conexión interrumpida en el portal, pasaron 23 regresiones, 15 combinaciones vista/ancho con API simulada y un caso de red por teclado. El sondeo real sin sesión devolvió denegación en cuatro tablas. Sin teléfono conectado. El repositorio público de presentación está accesible, y el checkout de esta versión aún carece de commit y remoto.

## Reanudación del viernes 6 a las 10:00

Objetivo operativo: versión candidata el martes 10/11 y verificación independiente el miércoles 11/11. El seminario del 18/11 y la mesa prevista para diciembre son hitos separados. La primera acción compartida es identificar un entorno Supabase exclusivo de evaluación. En paralelo, preparar el teléfono y un cable de datos; la prueba Android se hará con Sabrina.

Se repitió la regresión local (23/23, cero omitidas) y se comprobó que el SHA-256 del APK coincide con la compilación registrada. Se agregó el manual web con capturas de QA, se ubicaron los documentos de entrevistas cualitativas, SCAMPER y FODA bajo el nombre histórico GLOCKTA, y se detallaron responsables, dependencias y criterios diarios en CONTROL_ENTREGA_TESIS.md. Las fichas de entrevista sintetizan necesidades; para afirmar validación empírica se debe acreditar su procedencia. No se hizo una nueva corrida autenticada en la nube.

### Cierre de la revisión académica y técnica

- Recuperadas las 13 filas de la propuesta formal y contrastadas con la plataforma comprometida en `MATRIZ_ALCANCE.md`. La versión 3 del alcance registra seis historias de primer sprint y la observación de acotar por fases. Pendiente conciliar ambas versiones con el tutor.
- Se volvió a ejecutar la suite: 23/23. Career Passport exportó 32 proyectos académicos sintéticos a cuatro páginas A4. Se verificaron los 32 títulos en el texto del PDF generado en `output/qa/passport-extenso.pdf`. Repetición: `node scripts/verify-workspace.cjs --passport-extenso` con Playwright y Edge.
- Android: compilación debug y verificación de firma v2 correctas. SHA-256 del artefacto: `0722674890B22A28F0E1EBD5DA9CC12A3746DDF064DDD79E36A753AB3665318F`. El emulador no terminó de arrancar durante la validación de esta versión; queda pendiente la prueba de instalación y recorrido con dispositivo físico.
- Borrador principal para tutoría: `output/pdf/GLOVTA_Entrega_para_revision.pdf`, nueve páginas, índice con catorce destinos. El PL03 permanece en borrador.

## Empleabilidad

La lectura pública de Supabase devolvió dos registros en el catálogo histórico `jobs` y cero filas visibles en `opportunities`. El portal usa esta segunda tabla. La política de lectura pública requiere publicación vigente. Para distinguir tabla vacía, borradores y vencimientos hace falta ejecutar el diagnóstico de solo lectura documentado en `docs/EMPLEABILIDAD_EVALUACION.md` con acceso al inventario.

El módulo de empresa permite publicar, leer presentaciones recibidas y resolver postulaciones. Su habilitación requiere la migración de empresa, una membresía asignada por administración y la variable de entorno del servidor. El perfil de candidato puede adjuntar un mensaje. Se probaron las restricciones SQL con tres cuentas independientes en un clúster PostgreSQL 18.6 local y una oferta sintética. Evidencia en `output/qa/empleabilidad-postgres.json`. Para acreditar Supabase Auth y PostgREST en conjunto falta un proyecto de evaluación autorizado.

El resultado vigente de regresión es 23 pruebas aprobadas. El informe previo `output/qa/rls-real.json` conserva 13 verificaciones de Supabase sobre trayectoria profesional. En navegador, las cuatro vistas aprobaron con API simulada a 390, 768 y 1280 píxeles, con comprobaciones automatizadas de accesibilidad. Esta sección actualiza las cifras históricas que aparecen más abajo.

## Resultado de esta etapa

Se recuperaron los cambios incompletamente verificados de la sesión anterior. Sintaxis válida, rutas registradas y módulos compartidos servidos. Se implementaron pruebas específicas del CRUD, se corrigió la pérdida de borradores al guardar otras secciones, se agregaron reintentos independientes de carga y se integraron los registros guardados al Career Passport. La bienvenida permanece separada del dashboard, sin credenciales precargadas.

Archivos de implementación revisados/modificados: profile-model.js, server/profile-sections.js, server/app.js, portal.html, portal.js, portal.css.
Pruebas agregadas: test/profile-sections.test.js, scripts/verify-sections.cjs, scripts/verify-anonymous.mjs, scripts/verify-rls.mjs, scripts/verify-rls.ps1.
Documentación: docs/MODULOS_PERFIL_Y_PRUEBAS.md y este archivo.

## Verificación

22 pruebas Node aprobadas. Pruebas de navegador a 390 y 1280 px con API simulada aprobadas (CRUD, recuperación tras reingreso, Passport, borradores, cierre). Pruebas existentes del portal y perfil aprobadas. Acceso anónimo real a las cuatro tablas: HTTP 401.

Supabase real: las 13 comprobaciones de output/qa/rls-real.json pasaron el 5 de noviembre de 2026 (hora argentina). Ambas cuentas crearon, consultaron, editaron, recuperaron tras otro login y eliminaron sus registros en los cuatro módulos. Los intentos de operar sobre registros ajenos quedaron bloqueados en ambos sentidos.

## Próxima acción exacta

Completar el registro de cuenta desde la web y verificar el recorrido con una cuenta recién creada.

## Pendientes posteriores

1. Registro público, confirmación de correo y recorrido registro → login → perfil → guardar → recuperar. Pendiente validar una cuenta recién registrada; sesión en memoria.
2. Auditoría completa de accesibilidad, pruebas manuales de teclado y lector de pantalla.
3. Completar app Android (la compilación previa no prueba el flujo de perfil móvil).
4. Roles empresariales/administrativos, asesoría, formación, IA: revisar implementación antes de prometer funcionalidades.
5. Documentos académicos, evidencias y demo: seguir matriz de la cátedra. Conservar exposición previamente indicada de 30 minutos hasta aclarar el nuevo pedido de guion de 15 minutos.

Sin push, despliegue, cambio destructivo ni migración de producción en esta etapa. Repositorio local sin commits y archivos untracked: git diff no representa una línea base; conservar copia y revisar antes del primer commit.

## Matriz objetivo (nuevo máximo solicitado)

| Categoría | Máximo | Estado verificable |
|---|---:|---|
| Funcionalidad y persistencia | 20 | CRUD local probado; persistencia real autenticada comprobada en cuatro tablas |
| Arquitectura y seguridad | 20 | Filtros y validaciones probados; aislamiento entre ambas cuentas comprobado en cuatro tablas |
| UX/UI y accesibilidad | 15 | Responsive y bienvenida probados; WCAG completo pendiente |
| Testing y estabilidad | 15 | 22 pruebas y navegadores con mocks; integración directa autenticada aprobada; reingreso y recuperación de una habilidad confirmados manualmente |
| Web y móvil | 10 | Web local; Android incompleto |
| Documentación académica | 15 | Documentación parcial; falta contraste final con rúbrica |
| Defensa y entrega | 5 | Guiones previos; ensayo técnico y enlaces publicados pendientes |

Puntaje global no recalculado: no hay evidencia suficiente para una calificación académica objetiva. Los máximos son objetivos, no puntos obtenidos; no se declara 100/100.

Prueba manual del portal local conectado a Supabase (5 de noviembre de 2026): Sabrina confirmó que, después de guardar una habilidad, cerrar sesión y volver a ingresar con la misma cuenta, la habilidad apareció en Career Passport. Evidencia: confirmación de la usuaria en el chat. Alcance: una habilidad y una cuenta existente.

Registro disponible en la bienvenida del portal local mediante Crear una cuenta. El servidor delega el alta a Supabase Auth. Pasaron 23 pruebas Node y el recorrido de formulario con API simulada. Pendiente la entrega real del correo, confirmación, primer login y guardado con la cuenta nueva.

## Corte verificable del 6/11: candidato para revisión

Evidencia y límites en [la auditoría de excelencia](GLOVTA_AUDITORIA_EXCELENCIA_FINAL.md). Regresión 23/23; cuatro consultas anónimas denegadas en Supabase; siete grupos SQL locales aprobados. APK instalado y abierto en emulador API 36, todavía sin prueba autenticada física. Vercel: portada HTTP 200, portal HTTP 404. Pendientes la evaluación integrada con identidades QA, accesos externos, videos y decisión de alcance. Este corte no autoriza publicar.

## Reanudación del 7/11/2026: evaluación independiente

Revisados docs/HABILITAR_EMPRESA_QA.sql, scripts/run-evaluation.mjs, scripts/run-evaluation.ps1 y scripts/verify-rls.mjs. Habilitación empresarial preparada, todavía no confirmada en remoto. El ejecutor comprueba dos identidades y sus membresías antes de insertar fixtures; conserva el informe histórico de perfiles.

Verificación de configuración: referencia y URL de evaluación correctas; falta SUPABASE_PUBLISHABLE_KEY en .env.qa. No se ejecutaron operaciones remotas ni cambios de producción.

Ensayo del recorrido empresarial con API simulada aprobado el 7/11: publicación, postulación, revisión, aceptación y reingreso; cero excepciones JavaScript. Informe output/qa/empresa-web-local.json y capturas output/qa/empresa-local/. No acredita RLS remoto ni persistencia real. Sintaxis Node de los scripts revisados correcta. Las 23 regresiones históricas no se repitieron; no se cambiaron módulos del producto.

Pendientes: habilitar empresa en QA, ejecutar pruebas autenticadas con contraseñas ingresadas localmente, validar permisos efectivos (no basta contar 27 políticas), integración Android y acceso público 404. Mantener pendiente la aprobación integral del circuito y PL03.

### Conexión QA comprobada el 7/11/2026
Clave publicable configurada en .env.qa (ignorado por Git), exclusivamente para yecgzorcxkokanuxgwki. Auth settings HTTP 200, lectura pública de oportunidades HTTP 200, membresías empresariales anónimas HTTP 401. Evidencia: output/qa/conexion-evaluacion.json. No acredita aún autenticación de las dos cuentas ni sus permisos. Lanzado asistente local de contraseñas para iniciar prevalidación y ensayos autorizados.
