# Glovta · Auditoría de aceptación del 6 de noviembre

**Decisión.** Hay material para pedir orientación al tutor hoy. La entrega formal completa del viernes 6 o sábado 7 carece de evidencia suficiente. La fecha del martes 10 sirve como objetivo de versión candidata, condicionada al alcance y a las pruebas integradas.

## Cómo se cuentan los resultados

- Propuesta original: **0/13 requisitos íntegramente demostrados en todas sus plataformas con todos sus criterios (0 %)**, 7 en desarrollo y 6 pendientes según MATRIZ_ALCANCE.md. Los 13 tienen criterios abiertos. Varias funciones parciales sí están verificadas. El porcentaje de cumplimiento del **alcance obligatorio definitivo** sigue indeterminado mientras no se concilien la plantilla inicial y las seis historias del alcance v3 con la cátedra.
- Cobertura editorial: **14/14 rubros (100 %) incluidos en el PDF de revisión**. El índice y las secciones existen. La cobertura editorial no mide aceptación funcional o académica. Falta conformidad formal del tutor.
- Regresión local: **23/23 (100 %)**. En navegador, **15/15 combinaciones** de cinco vistas y tres anchos pasaron las aserciones del ensayo con API simulada, axe y control de consola. El denominador excluye TalkBack, navegación completa con lector y los roles sin implementación.
- Seguridad de trayectoria: 13 comprobaciones autenticadas y anónimas registradas en la corrida anterior. En este corte se repitió solo la lectura sin sesión: **4/4 denegadas** por PostgreSQL (HTTP 401, código 42501). La prueba entre dos identidades exige cuentas de QA.

## Matriz operativa

Las duraciones son horas activas orientativas para la acción indicada; excluyen espera de accesos, tutoría y publicación. Las ventanas indican factibilidad técnica, no compromiso institucional.

| Componente | Estado y evidencia | Problema | Prioridad | Esfuerzo | Dependencia | Acción y criterio de salida | 6–7 nov. |
|---|---|---|---|---|---|---|---|
| Alcance y PL03 | 13 filas primarias y plantilla editable | Alcance por fases y plataformas por conciliar | Crítica | 1–2 h + respuesta | Tutor, autora | Confirmar por escrito versión, exclusiones y roles evaluables | Consulta sí, respuesta incierta |
| Cuenta y perfil candidato | Acceso y recuperación observados, CRUD de trayectoria en informe real | Alta nueva, confirmación y reingreso completos requieren QA | Alta | 1–3 h | Correo y QA | Registrar cuenta limpia, editar y recuperar al reingresar | Condicional |
| Career Passport | PDF de cuatro páginas con los 32 registros ficticios | Falta revisar salida final con datos de evaluación y lector | Media | 1–2 h | Sesión QA y lector | Exportar y contrastar primera y última entrada | Sí |
| Empresa y candidato | Seis grupos de comprobaciones sobre PostgreSQL local, recorrido UI con API simulada | Sin validación integrada de publicación, duplicado y seguimiento con Auth; faltan edición de oferta y perfil empresarial completos | Crítica | 3–6 h solo prueba integrada | Proyecto QA con membresías | Oferta propia, envío único, reingreso, revisión y denegación cruzada | Condicional |
| Mentor, administrador y superadmin | Modelo documental. Administración local demo gestiona ejemplos del navegador | Faltan permisos reales, asignación, moderación y trazabilidad | Crítica si exigidos | Varios días; estimar al fijar alcance | Tutor y diseño de permisos | Probar una operación permitida y otra ajena para cada rol exigido | Cierre completo improbable |
| Formación, asesorías e IA | Recursos y prototipos; fase 1 prioriza asesoría y seguimiento | Sin evidencia integrada de todo el flujo ni IA/diagnóstico móvil | Alta | 2–4 h para auditar fase 1, desarrollo aparte | Alcance y backend de evaluación | Solicitar sin registro, confirmar y recuperar en administración | Prueba parcial posible |
| Android | Cliente Java y APK de depuración compilada; ADB detectó cero dispositivos | Consulta de perfil pendiente en teléfono. Ficha editable, postulaciones y otras funciones móviles del original siguen abiertas | Crítica | 1–3 h para instalación y verificación básica | Teléfono, cable y configuración QA | Guardar en web, recuperar en Android y cerrar sesión | Condicional |
| Diseño y accesibilidad | Captura real de Passport con datos ficticios, navegación por secciones, contraste navy/turquesa, PDF separado de edición | Estado de red sin traducir corregido. Falta inspección de la compilación móvil actual en ejecución y lectores | Alta | 2–4 h | Dispositivo y lector | Teclado, zoom y TalkBack en tareas críticas | Parcial |
| Entrega documental 1–10 | Portada/acta, requisitos, casos y diagramas de trabajo, Gantt en borrador | Confirmar datos institucionales, cardinalidades, notación UML y concordancia web/APK | Alta | 4–8 h | Alcance acordado | Contrastar cada diagrama y caso con la versión candidata | Revisión posible |
| Entregables 11–14 | APK local y repositorio público de presentación | Faltan dos demos, descarga, fuente de esta versión, portal público validado y cuentas evaluadoras | Crítica | 3–6 h tras validar versión | Roles, accesos y autorización para publicar | Probar todos los enlaces desde sesión externa y registrar resultado | Condicional |
| Investigación y defensa | FODA, SCAMPER, síntesis de entrevistas, Canvas, pitch, diapositivas previas y guion de 30 min | Falta acreditar insumos de encuestas, viabilidad con costos reales y ensayo cronometrado | Media | 2–5 h | Autora, cotizaciones y ensayo | Asociar afirmaciones con fuente o hipótesis y ensayar con respaldo | Parcial |

## Evidencia observada

Se examinó la captura de Passport a 390 px: la identidad, el nombre y la trayectoria tienen jerarquía legible, las acciones están separadas y el contenido sigue una columna. En Android se constató en código el uso de navy, cian, títulos y controles etiquetados. La inspección de código y capturas históricas no acredita coherencia visual de la APK actual instalada.

La prueba nueva activa el acceso por teclado y corta la petición de login de forma controlada. Antes mostraba un error interno en inglés. Después comunica la interrupción en español, conserva el correo y vuelve a habilitar el botón. Evidencias en output/qa/acceso-red-antes.png, acceso-red-despues.png y acceso-red.json. Una carga local en Edge dio aproximadamente 769 ms; es una observación de laboratorio, insuficiente para establecer rendimiento de producción.

GitHub confirmó HTTP 200 para el repositorio público sabrinaongarato79/glovta-presentacion. (incluido el punto final). La revisión de main encontró index.html y ninguna coincidencia con portal.html, android/ o server/app.js. El checkout local no tiene HEAD, archivos bajo seguimiento ni remoto. El portal /portal.html de la presentación en Vercel devolvió 404. Los dos intentos a Render no recibieron respuesta HTTP en 10 segundos por URL. Un timeout deja el servicio sin verificar.

## Ruta para la revisión

1. Llevar al tutor la propuesta original, el alcance v3 y la matriz de diferencias. Obtener la versión de alcance que evaluará.
2. Identificar QA separado y ejecutar empresa → candidato → empresa → reingreso, con dos roles y una cuenta ajena.
3. Instalar el APK configurado para ese mismo QA y comprobar el dato compartido desde un teléfono físico.
4. Fijar versión, revisar los manuales contra la pantalla real, grabar ambos recorridos y conservar evidencia con datos ficticios.
5. Validar los enlaces, completar PL03 y solicitar revisión formal con el PDF único. Con la aprobación del tutor corresponde pedir mesa a Alumnos.
