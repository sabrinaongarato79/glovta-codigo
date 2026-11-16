# Glovta | Informe para revisión de tesis

**Corte: 6 de noviembre de 2026. Objetivo: 10 de noviembre. Dictamen: apta para revisión técnica con observaciones; entrega final abierta.** La decisión académica corresponde al tribunal. El código de aplicación tiene una referencia local, `29a0926`; los ensayos posteriores y los documentos de trabajo se identifican por separado.

## Tablero de evidencia

| Dimensión | Nota /10 | Resultado al corte y límite |
|---|---:|---|
| Narrativa | 7 | [Guion de 30 minutos](docs/DEFENSA_NEGOCIO_Y_DEMO.md). Caso de primer empleo y roles definidos. Falta ensayo cronometrado con preguntas. |
| Accesibilidad | 5 | [Ensayo web](output/qa/espacio-profesional.json): cinco vistas en tres anchos, con datos simulados. [Teclado y error de red](output/qa/acceso-red.json). Falta lector real en web y TalkBack. Sin declaración de conformidad WCAG. |
| Demo integrada | 5 | [Empresa en navegador](output/qa/empresa-web-local.json) con API simulada; [PostgreSQL](output/qa/empleabilidad-postgres.json) con cuatro identidades. No prueban juntas el trayecto navegador–Supabase Auth. |
| Calidad y seguridad | 7 | [Regresión repetida](output/qa/regresion-excelencia.txt): 23/23. [Perfil](output/qa/rls-real.json): 13 controles previos. [Anónimo repetido](output/qa/anonymous-real.json): 4/4 HTTP 401. [Empleo repetido](output/qa/empleabilidad-postgres.json): 7 grupos, lote secuencial de 20 ofertas y 40 solicitudes en 767 ms. No mide concurrencia ni latencia de internet. |
| Trazabilidad | 6 | [Matriz fuente](MATRIZ_ALCANCE.md) y recorrido por requisito abajo. De los 13 requisitos originales, 7 parciales y 6 pendientes; ninguno aceptado íntegramente en todas sus plataformas. Denominador definitivo pendiente de cátedra. |
| Viabilidad | 5 | [Calculadora editable](outputs/cierre-2026/Glovta_Costos_y_Rentabilidad.xlsx). Hay mecanismo de cálculo y segmentos; faltan facturas, costo de soporte y disposición real a pagar. |
| Preparación ante el tribunal | 6 | Veinte preguntas abajo, con límites verificables. Falta ensayo oral con interrupciones y control del tiempo. |
| Entrega reproducible | 4 | [Fuentes congeladas](outputs/cierre-2026/Glovta_fuentes_29a0926.zip), [manual web](docs/MANUAL_WEB.md), [manual Android](docs/MANUAL_ANDROID.md) y PDF de revisión. Falta instalación externa, video final y recorrido desde un equipo ajeno. |

Escala: 0 sin evidencia, 5 evidencia parcial, 8 recorrido reproducible con límites menores, 10 aceptación integral acreditada. Las notas valoran la preparación de cada dimensión; no se promedian para predecir la calificación. No hay un inventario exhaustivo de defectos críticos que permita afirmar «cero errores». El informe de alcance identifica bloqueos de aceptación, que son distintos de fallas observadas.

## Lectura por requisito: qué mostrar si el tribunal lo elige

Cruzar el ID con la fila correspondiente de [MATRIZ_ALCANCE](MATRIZ_ALCANCE.md) para su plataforma y criterio completo. «Pendiente» significa que falta el resultado, aunque haya una propuesta.

| RF original | Caso de uso | Implementación pertinente | Prueba y resultado / evidencia |
|---|---|---|---|
| O01 | Crear cuenta y volver a entrar | portal.js, server/auth.js, Android AuthClient | [Regresión](output/qa/regresion-excelencia.txt); alta autónoma + confirmación en QA pendientes |
| O02 | Guardar y recuperar trayectoria | server/profile-sections.js y migración professional_profile | [CRUD y aislamiento web](output/qa/rls-real.json); ficha editable móvil pendiente |
| O03 | Obtener diagnóstico | No acreditada en Android | Pendiente: completar evaluación y recuperar resultado |
| O04 | Recibir recomendaciones con IA | No acreditada en Android | Pendiente: verificar entradas, salida útil y límites |
| O05 | Consultar recursos | index.html; catálogo web | [Alcance](MATRIZ_ALCANCE.md); curso y avance por plataforma pendientes |
| O06 | Generar CV con IA | Passport web exporta; generador IA móvil no acreditado | [PDF de trayectoria extensa](output/qa/passport-extenso.pdf); no satisface este RF |
| O07 | Recuperar estado de candidatura | server/employer.js y migración employer_workflow | [Estado, persistencia y duplicado en SQL](output/qa/empleabilidad-postgres.json); falta Android |
| O08 | Recibir notificación push | Sin entrega acreditada | Pendiente: permiso, recepción y rechazo en teléfono |
| O09 | Gestionar solicitudes como administrador | admin.html, demostración local | [Matriz](MATRIZ_ALCANCE.md); administración persistente con usuario autorizado pendiente |
| O10 | Consultar indicadores institucionales | Sin tablero institucional validado | Pendiente: contrastar agregados con registros conocidos |
| O11 | Publicar y revisar candidaturas | server/employer.js; PostgreSQL | [7 grupos locales](output/qa/empleabilidad-postgres.json); filtros de candidatos y aceptación integrada pendientes |
| O12 | Mentor revisa ficha asignada | Sin panel real validado | Pendiente: acceso permitido a ficha asignada y denegado a otra |
| O13 | Completar tarea con tecnología de apoyo | portal.html, portal.css, MainActivity.java | [Ensayo web](output/qa/espacio-profesional.json); prueba humana con lector pendiente |

## Cinco minutos de demo y alternativa sin red

Usar datos ficticios y dos sesiones separadas del mismo QA. Antes de exponer, comprobar que el candidato ve la oferta correcta y preparar una búsqueda nueva para que la demostración no dependa de borrar registros.

| Tiempo | Acción | Evidencia que debe ver el público |
|---|---|---|
| 0:00–0:50 | Empresa publica «Analista de procesos · Demo» con identificador de ensayo | La búsqueda se puede recuperar desde la cuenta candidata |
| 0:50–1:50 | Candidata presenta un proyecto académico en Career Passport | El proyecto cuenta aunque no exista experiencia laboral formal |
| 1:50–2:40 | Con teclado, localizar la oferta y postularse | Foco visible, confirmación y una sola candidatura |
| 2:40–3:40 | Empresa abre su bandeja y modifica el estado | Su bandeja contiene esa postulación; una empresa ajena queda fuera |
| 3:40–5:00 | Candidata cierra sesión, reingresa y consulta estado | Mismo identificador y nuevo estado recuperados. Mostrar Android por separado para la lectura del perfil |

**Si falla internet:** abrir [captura web](output/qa/career-passport-1280.png), [vista estrecha](output/qa/career-passport-390.png), [exportación](output/qa/passport-extenso.pdf) y resultado SQL local. Nombrar el entorno de cada evidencia. Falta grabar el video de ambos roles contra QA y el video en teléfono. Para el tramo de inclusión, ensayar Tab, Shift+Tab, Enter, anuncio de errores y retorno de foco con lector activo. Registrar tarea, dispositivo, lector y resultado.

## Preguntas del tribunal

**Arquitectura, base y seguridad**

1. ¿Dónde se controla el acceso? La web valida solicitudes en Express y la base aplica políticas por fila. Android consulta el perfil con la identidad de Supabase.
2. ¿Alcanza ocultar un botón? No. La prueba intenta operar sobre registros ajenos y verifica el rechazo en la base.
3. ¿Qué evita dos postulaciones? La unicidad de candidato y oferta en PostgreSQL. El ensayo intenta el segundo envío.
4. ¿Quién decide el estado? La empresa propietaria sigue las transiciones previstas; la prueba incluye cambio ajeno y reapertura prohibida.
5. ¿Publicar una fila en jobs la convierte en una oportunidad? Son estructuras distintas. Para la demo hay que verificar la oferta publicada en opportunities con permisos y vigencia correctos.
6. ¿Un acceso HTTP 401 demuestra aislamiento entre dos usuarios? Solo demuestra el rechazo anónimo observado. El reporte autenticado de trayectoria compara dos identidades.
7. ¿Probamos la cadena completa? En empleo probamos SQL y navegador por separado. Falta el ensayo conjunto en Supabase de evaluación.

**Ingeniería, experiencia y calidad**

8. ¿Qué falla si se pierde la red en el login? El formulario conserva el correo, vuelve a habilitar el envío y comunica el error; ver acceso-red.json.
9. ¿23 pruebas significan 100 % de cobertura? Son 23 casos aprobados. No miden porcentaje de líneas ni aceptación académica.
10. ¿Cómo sabemos que el CV no se trunca? Hay exportación de 32 registros en cuatro páginas. Contrastar primera y última entrada con los datos de ensayo.
11. ¿Es accesible con lector? Hay evidencia automática y parcial con teclado. Falta prueba de tareas con lector de pantalla y TalkBack.
12. ¿Qué cuenta como éxito en Android? Instalar el APK, entrar, recuperar un titular guardado en web y salir, en el mismo QA y en teléfono físico. Compilar solo acredita el empaquetado.
13. ¿Cómo reproducir esta versión? Usar el ZIP identificado por commit y cotejar el hash del APK. La distribución externa del conjunto está pendiente.
14. ¿Qué alcance se evaluará? La propuesta tiene trece requisitos y el alcance por fases prioriza seis historias. La autora debe confirmar con el tutor cuál rige.

**Negocio y validación**

15. ¿Quién pagaría? La hipótesis inicial es una empresa con búsquedas activas que necesita seguimiento; la candidata tendría acceso básico gratuito.
16. ¿Qué problema justificaría el precio? Organizar candidaturas y reducir seguimiento manual. Medir tiempo por búsqueda y contrastarlo con una entrevista de compra.
17. ¿Cuánto cuesta operar? No hay total acreditado: separar infraestructura, consumos, soporte humano y adquisición. Cargar respaldo y fecha en la calculadora.
18. ¿Cuál es el punto de equilibrio? Redondear hacia arriba costos fijos mensuales divididos por contribución mensual por empresa. Si precio neto menos costo variable es cero o negativo, no hay equilibrio finito con ese plan.
19. ¿Qué ventaja se puede sostener? La hipótesis es reutilizar formación y proyectos en un perfil accesible y seguir el resultado. Falta medir si el usuario vuelve y si la empresa renueva.
20. ¿Qué impacto social se midió? Todavía no se acreditaron contrataciones atribuibles. Un piloto debe medir finalización sin ayuda, barreras observadas y continuidad del trámite con consentimiento.

## Condiciones para el 10 de noviembre

1. Confirmar referencia de Supabase QA distinta de producción. Usar cuentas sintéticas, registrar publicación, duplicado, cambio de estado, acceso ajeno y recuperación tras reingreso.
2. Repetir el perfil en teléfono Android y comprobar foco, ampliación de texto y TalkBack. Adjuntar captura o video de datos ficticios.
3. Acordar alcance con tutor y cerrar trazabilidad, PL03, enlaces y usuarios evaluadores. Probar web, APK, videos y documentos desde otro equipo con sesión limpia antes de presentar.
4. Actualizar resultados contra esa versión y ensayar 30 minutos. Si algún criterio sigue abierto, mostrar su evidencia parcial y rotular el pendiente.

Cierre oral sugerido: «Para alguien que busca su primer empleo, un proyecto académico también cuenta una historia profesional. Glovta busca que esa historia se pueda presentar, que una empresa pueda considerarla y que la persona pueda saber qué pasó después».

## Evidencia adicional del mismo corte

- Android: instalación de la APK debug por ADB con resultado Success y arranque en frío de com.glovta.app/.MainActivity con Status: ok en Medium Phone API 36. [Pantalla capturada](output/qa/android-acceso.png) y [árbol de controles](output/qa/android-acceso.xml). El árbol contiene campos vacíos, un control de contraseña y botón de acceso. No se ingresaron credenciales. El arranque medido en este emulador bajo carga no se usa como referencia de rendimiento físico. El intento de grabación no produjo un video utilizable.
- Distribución: el 6/11 la portada de Vercel respondió HTTP 200 y /portal.html respondió 404. Los dos enlaces Render informados no respondieron dentro de 10 segundos; ese ensayo no permite concluir que estén caídos. No se acreditó descarga pública del APK.
- Material oral: [presentación editable con notas](outputs/cierre-2026/Glovta_defensa_revision.pptx) y [copia PDF para proyectar sin conexión](outputs/cierre-2026/Glovta_defensa_revision.pdf). PDF visual; para leer el contenido como texto usar el guion o la presentación editable.

| Diapositiva y minutos | Requisito o decisión | Evidencia para abrir |
|---|---|---|
| 1, 0–3 | Problema y público | Guion: persona ficticia que busca primer empleo |
| 2, 3–6 | O02, trayectoria | career-passport-1280.png y passport-extenso.pdf |
| 3, 6–9 | Viabilidad | Calculadora, hojas de presupuesto e hipótesis |
| 4, 9–14 | O07 y O11 | Guion de cinco minutos, empresa-web-local.json y empleabilidad-postgres.json |
| 5, 14–17 | O13 | espacio-profesional.json, acceso-red.json |
| 6, 17–20 | O01 y O02 en Android | android-acceso.png y manual Android |
| 7, 20–23 | Arquitectura y privacidad | Migraciones core, professional_profile, employer_workflow |
| 8, 23–26 | Calidad | Tablero al comienzo de este documento |
| 9, 26–28 | Distribución y alcance | CONTROL_ENTREGA_TESIS.md y MATRIZ_ALCANCE.md |
| 10, 28–30 | Impacto por validar | Protocolo cualitativo en DEFENSA_NEGOCIO_Y_DEMO.md |

Capturas que aún faltan del mismo ensayo integrado: empresa con oferta publicada, candidatura enviada, estado tras reingreso y perfil recuperado en un teléfono. Registrar solo identidades de evaluación.
