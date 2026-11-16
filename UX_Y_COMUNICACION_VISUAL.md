# GLOVTA: UX y comunicación visual para la defensa

Revisión local: 3 de noviembre de 2026. Prototipo académico; no equivale a un servicio comercial operativo ni garantiza una calificación.

## Criterio de diseño

La identidad conserva azul marino, acentos cian, composición editorial y la imagen principal aprobada. La jerarquía distingue la propuesta, las acciones principales y los detalles progresivos. Personas y empresas tienen recorridos diferenciados. Los acordeones reducen la longitud inicial, aunque su capacidad de descubrimiento debe validarse con participantes reales.

Se revisó el lenguaje para que el visitante entienda el valor y el estado del producto. El perfil se guarda en este navegador; los puntajes son ilustrativos; las oportunidades no son vacantes activas; Premium es una propuesta. Reservar o guardar una consulta no implica que alguien haya recibido el mensaje. Esta precisión es parte de una comunicación profesional.

## Decisiones implementadas y cómo defenderlas

| Decisión | Propósito | Evidencia |
|---|---|---|
| Jerarquía tipográfica y mayor tamaño de controles | Facilitar lectura y selección | Capturas desktop y móvil |
| Azul más oscuro en botones principales | Mejorar legibilidad del texto blanco | Inspección visual; falta auditoría completa de contraste |
| Ventanas con nombre accesible, Tab contenido y Escape | Permitir completar el recorrido con teclado | Prueba específica de carrito |
| Indicador textual de paso y foco en el siguiente campo | Orientar durante la carga del perfil | Prueba de perfil |
| Confirmación persistente al guardar | Dar tiempo para leer el resultado | Prueba de perfil |
| Cero resultados reales y acción para restablecer búsqueda | Evitar resultados irrelevantes y permitir recuperación | Prueba de búsqueda |
| Diseño sin desbordamiento a 320 px y texto al 200 % en escritorio | Mantener acceso al contenido en distintos tamaños | Prueba de dimensiones |

## Verificación

Se aprobaron 8 pruebas de API local, 13 escenarios funcionales en Edge y los mismos 13 en Chrome, más 4 escenarios de UX en Edge. Son 38 ejecuciones, con escenarios compartidos entre navegadores; no son 38 funcionalidades independientes. El ajuste final de contención de Tab se verificó en la suite de UX de Edge. No se hizo una certificación WCAG ni un estudio de usabilidad con personas.

Evidencia: `output/qa/browser-results-msedge.json`, `output/qa/browser-results-chrome.json`, `output/qa/ux-results.json`. Scripts reproducibles: `scripts/verify-browser.cjs` y `scripts/verify-ux.cjs`. Limitaciones técnicas adicionales en `INFORME_PRUEBAS.md`.

Referencias de criterio: [patrón de diálogo modal de W3C](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) y [contraste mínimo WCAG](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html). Referenciarlas no implica conformidad total.

## Preguntas para preparar

- ¿Por qué esta paleta? El fondo oscuro estructura la marca, el cian destaca información y el azul identifica acciones. La elección se debe evaluar también por legibilidad, no solo por estética.
- ¿Cómo sabés que es usable? Existen pruebas técnicas de interacción y adaptación. Falta medir comprensión, finalización de tareas y errores con usuarios representativos.
- ¿Qué distingue un prototipo de un servicio terminado? Aquí hay persistencia local y muestras; autenticación, operaciones remotas e integraciones requieren validación real antes de producción.
- ¿Cómo justificarías la próxima mejora? Observando a participantes buscar una oportunidad, completar un perfil y localizar una solución empresarial; registrar dificultades y corregir las de mayor impacto, sin inventar resultados.

## Trabajo pendiente para cerrar la evaluación

Validar tareas con usuarios, revisar con lector de pantalla, auditar contraste en todos los estados, contrastar la entrega con la rúbrica oficial y completar las integraciones pendientes. El acabado visual debe acompañarse de evidencia y decisiones que puedas explicar. No se afirma autoría exclusivamente humana ni se inventa investigación para presentar el proyecto.
