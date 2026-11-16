# Glovta: competencia, diferenciación y continuidad

Fecha: 14 de octubre de 2026. Mercado supuesto: Argentina, con expansión posterior a Latinoamérica. Revisión de páginas oficiales y del código local. No se entrevistaron clientes ni se compraron servicios de competidores; las oportunidades comerciales son hipótesis para validar, no defectos demostrados de esas empresas.

## Recomendación

Glovta reúne empleo, formación, servicios digitales, inmobiliarias, comercios y gestión financiera. Esa amplitud es una visión posible, pero para comenzar dispersa el esfuerzo y dificulta explicar qué problema resuelve y quién paga. Recomiendo iniciar con un servicio para comercios y pequeñas empresas: ordenar consultas y seguimiento comercial, acompañado de un reporte operativo simple y capacitación. Mantener empleabilidad como segunda línea en preparación. Si ya existe una cartera o experiencia más fuerte en otro sector, revisar esta prioridad antes de invertir.

Propuesta a validar: «Te ayudamos a organizar tus consultas, dar seguimiento y entender tus resultados, con implementación y acompañamiento». Es una propuesta de posicionamiento; no se cambió el texto de la web.

La ventaja potencial está en entender el proceso del cliente, instalar lo necesario, enseñar a usarlo y demostrar resultados. Una web bonita, IA, accesibilidad básica, cursos o un panel por sí solos no constituyen una ventaja exclusiva.

## Comparación

| Competidor y línea | Fortaleza verificada | Fricción u oportunidad para Glovta | Forma concreta de destacarse |
|---|---|---|---|
| LinkedIn: empleo | Ofertas gratuitas y promocionadas; las pagadas pueden ocupar posiciones destacadas y recibir distribución adicional. | La visibilidad ampliada requiere presupuesto; esto no demuestra que las ofertas gratuitas sean ineficaces. Hipótesis: un público específico valoraría ayuda para preparar su candidatura. | Preparación para roles concretos, revisión humana, ejercicios y seguimiento. Usar LinkedIn como canal complementario. |
| Workana: proyectos freelance | Facilita relaciones entre clientes y profesionales; publica comisiones por relación. | La comisión inicial al profesional es del 20%, con reducción por volumen acumulado con un cliente. Es un costo comprobable, no prueba de mal servicio. | En clientes obtenidos por canales propios, vender un proyecto con alcance, entregables y soporte claros. Contemplar el costo de captar clientes y las protecciones que no ofrece un contrato directo automáticamente. |
| Coursera: formación | Programas y credenciales de universidades y empresas; recorridos y proyectos aplicados. | No hay base para afirmar que carece de práctica o calidad. Hipótesis: algunas personas necesitan adaptación a su contexto y corrección individual. | Taller breve vinculado a una tarea real, devolución personalizada y evidencia de trabajo. No intentar competir por cantidad de cursos o prestigio de certificados. |
| Tiendanube: comercios | Plan inicial gratuito, pagos, envíos, integraciones y soporte humano; algunas funciones dependen del plan. | Hay elecciones de plan, configuración y posibles costos por transacción/procesamiento. No es válido afirmar que no brinda acompañamiento. | Implementación para un nicho, carga inicial, organización del proceso y capacitación; integrar herramientas existentes cuando convenga. No reconstruir una plataforma completa para empezar. |
| Tokko Broker: inmobiliarias | CRM, consultas, difusión, seguimiento, API y reportes. | Ya resuelve varias funciones anunciadas por Glovta. Hipótesis: puede haber necesidades específicas de implementación o integración. | Integraciones y automatizaciones puntuales, datos ordenados y capacitación. Validar entrevistas antes de intentar reemplazar un CRM consolidado. |

No se atribuyen defectos de seguridad, mala atención o baja accesibilidad a competidores sin pruebas. Computrabajo, Bumeran y ZonaJobs son referencias adicionales para una siguiente comparación dedicada a empleo; no se verificaron sus condiciones comerciales completas en este análisis.

## Dónde puede sobresalir Glovta

1. Un nicho y un problema comprensible: por ejemplo, comercios que pierden consultas por falta de seguimiento.
2. Una implementación completa: diagnóstico, configuración, entrega, capacitación y soporte con límites explícitos.
3. Resultados observables: tiempo de respuesta, consultas con seguimiento, horas de trabajo manual y uso real de la herramienta. Medir un punto de partida; no prometer ventas o empleos garantizados.
4. Transparencia: qué incluye, qué cuesta, quién responde, qué queda fuera, qué datos se guardan y cómo se exportan.
5. Inclusión comprobada: navegación por teclado, formularios entendibles y pruebas con personas. Los botones de tamaño y contraste actuales no certifican accesibilidad.

Una combinación futura con formación puede reforzar el servicio: enseñar a la empresa a usar lo que se implementó. Para empleabilidad, ofrecer un recorrido para un rol específico, con habilidades demostrables y orientación. Esa línea necesita oportunidades autorizadas o enlaces externos claros; no porcentajes de coincidencia inventados.

## Revisión técnica local

### Corregido en esta revisión

- La API de perfil aceptaba nombres heredados de Object, como constructor o toString, por usar `in` en la lista de campos permitidos. Se reemplazó por Object.hasOwn y se agregó una prueba de regresión.
- Se reforzó la validación del cuerpo de postulaciones: objeto y UUID de tipo string.
- El tamaño de letra leído del almacenamiento ahora se limita al rango previsto y recupera el valor normal ante datos inválidos.
- El avance del Career Passport comprueba los campos visibles antes de pasar de etapa. Antes podía dejar el objetivo obligatorio vacío y llegar al guardado con el campo oculto.

Pruebas ejecutadas: `npm test`, cinco pruebas aprobadas; `node --check app.js` y `node --check sw.js`, sin errores de sintaxis. Las pruebas de backend usan Supabase simulado. La corrección de los controles del frontend se verificó en código y sintaxis; falta comprobar la interacción en navegador en esta revisión.

### Bloqueos y riesgos pendientes

| Prioridad | Hallazgo | Qué debe hacerse |
|---|---|---|
| Alta | Supabase no está conectado y no hay registro/login visual. | Configurar proyecto, aplicar esquema en proyecto nuevo y probar dos cuentas reales con RLS. |
| Alta | Career Passport usa goal, country, skills, languages y experience; la tabla profiles y la API usan full_name, headline, location y bio. | Definir modelo de datos y migración que conserven los campos reales del Passport. No conectar mediante un mapeo que descarte información. |
| Alta | Consultas y reservas quedan en localStorage. El correo glovta.example no recibe mensajes. | Crear un canal comercial real y persistencia privada. Verificar recepción antes de quitar la etiqueta demo. |
| Alta | La agenda no valida desde el servidor la disponibilidad ni evita reservas simultáneas entre navegadores. Tampoco hay validación completa de fechas/horarios pasados al enviar. | Modelar disponibilidad, zona horaria y restricción única de horario en base de datos; confirmar solo tras éxito. |
| Alta | Admin es público y demo. | No conectar datos de terceros hasta tener autenticación y autorización de administración verificadas. Hoy el acceso público no demuestra una fuga de datos remotos: todavía lee datos locales. |
| Media | El catálogo y el checkout no entregan contenido ni cobran. | Definir productos reales, precio en servidor, entrega y estados de pago antes de vender. |
| Media | Porcentajes de match de empleos son valores estáticos demo. | Mantener su carácter ilustrativo o sustituir por criterios explicables, sin convertirlos en resultados reales. |
| Media | Algunas escrituras y lecturas directas de localStorage pueden lanzar excepciones si el almacenamiento falla; datos guardados carecen de validación completa. | Manejar fallos sin confirmar guardados que no ocurrieron; validar forma de registros. |
| Media | El backend depende de configurar una clave publicable; no bloquea automáticamente todas las variantes de claves privilegiadas mal configuradas. | Añadir validación de configuración y comprobar RLS con sesiones reales. No usar service_role/secret. |
| Media | El perfil puede perder campos si se envía PUT parcial: los campos opcionales omitidos se vacían. | Mantener semántica de reemplazo explícita o implementar PATCH antes de conectar edición parcial. |

No se certifican cero errores, seguridad de producción, accesibilidad completa ni todos los flujos móviles. No se aplicó SQL remoto, no se publicó y no se hicieron commits.

## Cómo continuar, en orden

1. Validar el enfoque: conversar con cinco pequeños comercios, anotar problema, herramienta actual, costo del problema y disposición a pagar. Son acciones propuestas; no contactos realizados.
2. Definir un paquete inicial: un proceso, entregables, plazo, soporte y costo basado en horas y herramientas. Un piloto acotado permite validar antes de ampliar la plataforma.
3. Para ese lanzamiento comercial, priorizar contacto real, consultas persistidas y administración privada. El backend actual de perfiles/postulaciones sirve para la línea de empleo; todavía no cubre estos flujos B2B.
4. Configurar Supabase con URL y clave publicable mediante `.env`; nunca pedir ni compartir contraseña, clave service_role o tokens privados en el chat. Aplicar migraciones conforme a la situación real de la base.
5. Completar autenticación, autorización y las tablas necesarias para el alcance elegido. Si se prioriza empleabilidad, resolver primero la diferencia del modelo Career Passport.
6. Verificar el recorrido completo con dos usuarios, acceso de terceros rechazado, persistencia entre navegadores, errores de red, entradas inválidas y móvil/teclado. Para reservas, probar dos envíos simultáneos al mismo horario.
7. Quitar demo únicamente de las funciones efectivamente conectadas y verificadas. Las otras pueden seguir como demostración o pasar a Próximamente según decisión de producto.
8. Publicar una versión acotada cuando existan canal comercial, permisos, tratamiento de datos, entrega y recuperación de errores; medir resultados del piloto y decidir la siguiente etapa.

Primera decisión recomendada: lanzar servicios para comercios como oferta inicial, con contacto y consultas reales. No agregar pagos, IA y bolsa de empleo a la vez. Si la prioridad es empleabilidad, el siguiente trabajo técnico es ajustar el modelo Passport y conectar registro, sesión y perfil.

## Fuentes oficiales consultadas

- [LinkedIn: ofertas promocionadas](https://business.linkedin.com/hire/promoted-jobs).
- [Workana: comisiones](https://help.workana.com/hc/es/articles/360041235874--C%C3%B3mo-se-calcula-la-comisi%C3%B3n-en-Workana).
- [Coursera Plus](https://www.coursera.org/courseraplus). No se usa su precio mostrado porque la página se localizó en otra moneda.
- [Tiendanube: planes y precios](https://www.tiendanube.com/planes-y-precios).
- [Tokko Broker: funcionalidades](https://www.tokkobroker.com/es-otros/funcionalidades).

Precios y condiciones pueden cambiar. Se priorizaron diferencias de modelo y funciones sobre cifras promocionales.
