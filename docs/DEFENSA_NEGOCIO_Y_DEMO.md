# Glovta · Del perfil profesional al seguimiento de una postulación

## Observaciones de clase aplicadas

Esta matriz toma las observaciones de Cavasso según el relato aportado por Sabrina. La condición académica se contrasta con Entregables 2025.05 y PL03 2026.01.

| Observación | Vínculo académico | Evidencia y estado | Acción pendiente | Prioridad y riesgo al 10/11 |
|---|---|---|---|---|
| Mostrar el proceso completo | Demo web y casos de uso | Flujo en navegador con API simulada, reglas en PostgreSQL local | Repetir ambos roles juntos en Supabase de evaluación | P0 alto |
| Explicar quién opera | Roles y accesos PL03 | Candidato con CRUD probado; empresa con publicación y bandeja en evaluación local | Validar membresías y permisos. Mentor, administrador real y superadmin requieren decisión de alcance | P0 alto |
| Mostrar circulación de datos | Arquitectura, componentes, DER | Web → Express → Supabase Auth/PostgREST → PostgreSQL. Android accede directamente a Auth y a la API de datos para su perfil | Recuperar en el teléfono el dato guardado en web | P0 alto |
| Sustentar privacidad | RNF y casos negativos | RLS, validación de campos, límite JSON de 16 KB, listas de hasta 100, restricción única y transiciones. Acceso anónimo denegado previamente en cuatro tablas | Límites por frecuencia, resistencia al scraping, bitácora de negocio y recuperación desde respaldo carecen de aceptación específica | P1 alto |
| Probar uso representativo | Casos de prueba | Ensayo secuencial local con 20 ofertas, 40 solicitudes, tres estados, dos empresas y dos candidatos | Medir concurrencia en evaluación antes de estimar capacidad | P1 medio |
| Explicar calidad y versiones | Código fuente y repositorios | Versión local 29a0926 reproducida en carpeta limpia; caso de error de red corregido | Vincular las fuentes y la APK exactas a un acceso externo revisado | P0 alto |
| Mostrar costos y equilibrio | Complemento de viabilidad del acta | Calculadora editable para tres escenarios y cuatro volúmenes | Incorporar facturas, horas y precios aceptados por compradores | P1 medio |
| Conocer mercado y competencia | Acta obligatoria | Benchmark y análisis recuperados en Descargas, propuesta y Canvas | Contrastar las hipótesis de diferenciación con observaciones de compradores | P1 medio |
| Delimitar mercado y soporte | Acta y propuesta comercial | Argentina, español y atención remota como propuesta inicial | Costear soporte y acordar condiciones antes de vender | P2 bajo |
| Fundamentar investigación | Investigación del acta | Fichas cualitativas de Planificación y SCAMPER | Confirmar procedencia y respaldar encuesta antes de usar porcentajes | P1 medio |
| Facilitar acceso a documentos | Manuales, PL03, rubros 11–14 | Manual web ilustrado, borrador Android, PDF ordenado | Grabar videos finales, revisar enlaces externos con otra cuenta | P0 alto |
| Ensayar defensa | Demo técnico-comercial | Guion con recorrido y preguntas abajo | Cronometrar con teléfono real y respaldo local | P1 medio |

## Empresa, producto y oferta

Glovta es la marca de una iniciativa de empleabilidad. Su producto es el portal profesional y su cliente Android. Una persona organiza proyectos, idiomas y formación en un Career Passport. Una empresa necesita recibir y seguir candidaturas para una búsqueda propia. Una institución educativa podría ofrecer el servicio a sus egresados. La iniciativa aún debe acreditar clientes pagos y acuerdos institucionales.

| Oferta propuesta | Beneficio y límite de alcance | Precio y método | Soporte y costo por validar |
|---|---|---|---|
| Candidato B2C | Crear perfil y exportar Passport web. El uso móvil actual se concentra en consultar la presentación | Acceso básico gratuito propuesto | Manual y ayuda remota. Medir consultas por alta |
| Orientación premium B2C | Una revisión humana de CV o sesión de empleabilidad. Idiomas y capacitación requieren contenidos, responsables y cupos | Cotizar por sesión con horas de preparación, atención y margen objetivo | Seguimiento acotado a la sesión. Confirmar disponibilidad |
| Empresa B2B | Publicar búsquedas y seguir postulaciones. Evaluación técnica pendiente en QA integrado | Probar suscripción mensual por equipo. Piso de precio = soporte directo + parte de operación por empresa + contribución necesaria | Alta guiada y correo en días hábiles. Objetivo piloto propuesto: primera respuesta en dos días hábiles |
| Institución B2B2C | Acompañar una cohorte de egresados. Reportes y mentorías institucionales requieren alcance y permisos específicos | Cotizar por cohorte según tamaño, formación y horas asignadas | Referente institucional y capacitación remota acordada |

Comenzar en Argentina con interfaz en español. Antes de expandir a otro país, validar lenguaje, costos y capacidad de soporte. Inglés, portugués, pagos, marketing automatizado y gamificación quedan como opciones comerciales futuras. La condición académica de IA, push y mentoría depende de la resolución docente sobre la propuesta original.

## Investigación y ensayo de usabilidad

| Segmento | Necesidad y método | Participantes acreditables y resultado disponible | Problema y mejora que se probará | Evidencia a conservar |
|---|---|---|---|---|
| Primer empleo | Ficha cualitativa sobre orientación y cómo mostrar experiencia | Existe síntesis en GLOCKTA_01_Entrevistas_Cualitativas.pdf. Cantidad de personas entrevistadas, reclutamiento y fecha de campo por acreditar | Cargar un proyecto académico y exportar CV sin ayuda | Consentimiento y registro anonimizado, tarea completada, tiempo y dudas |
| Reconversión | Ficha cualitativa sobre traducir experiencia a un perfil | El documento describe dificultades para presentar trayectoria. Falta evidencia primaria para generalizar | Editar titular y recuperarlo tras salir e ingresar | Registro de tarea y problema observado |
| Equipo de selección | Ensayo propuesto de publicación y seguimiento | Sin comprador ni sesión de usabilidad acreditados | Publicar, localizar solicitud y comunicar estado con datos sintéticos | Tiempos por tarea, abandonos, instrucciones solicitadas y decisión de piloto |

En cada ensayo pedir «mostrame cómo harías esto» sin indicar botones. Registrar logrado sin ayuda, con ayuda o interrumpido. Preguntar al final dónde esperaba encontrar la acción; priorizar correcciones cuando una tarea crítica quede bloqueada. Mantener testimonios y credenciales fuera de la demo.

## Guion de 30 minutos

| Minutos | Acción frente al tribunal | Qué explicar y cómo verificar |
|---|---|---|
| 0–3 | Presentar a una persona ficticia que busca su primer puesto | Necesita explicar proyectos académicos y seguir su candidatura. Distinguir el caso narrativo de la investigación documentada |
| 3–6 | Mostrar la propuesta para personas, empresas e instituciones | Frente a la búsqueda en portales como Computrabajo o Bumeran y la red profesional de LinkedIn, Glovta propone unir trayectoria reutilizable y seguimiento. La ventaja percibida se valida con usuarios |
| 6–9 | Abrir la calculadora en Presupuesto, Hipotesis y Escala | Identificar quién pagaría, el costo fijo, el variable y cuántas empresas cubren el servicio. Mostrar una cotización o factura si existe |
| 9–12 | Empresa QA abre Oportunidades y publica «Analista de procesos · Demo» con requisitos explícitos en la descripción | La membresía identifica la empresa. La fila de opportunities contiene descripción y estado publicado |
| 12–16 | En otra sesión, candidato ingresa, guarda titular, agrega un proyecto, abre Passport y exporta | profiles y profile_experiences se asocian a su identidad. Mostrar recuperación y PDF; para un perfil extenso usar el archivo de QA |
| 16–20 | Buscar la oferta, leer los requisitos y postularse. Empresa actualiza a revisión; candidato cierra sesión, reingresa y consulta | applications vincula perfil y oferta. La pareja es única. Explicar que la empresa propietaria decide el estado. Mostrar evidencia del rechazo de duplicado y acceso ajeno |
| 20–23 | En Android iniciar sesión con ese candidato y consultar el mismo titular | El APK usa Supabase Auth y consulta su propio perfil. Ensayar en el mismo entorno; si falta validación física indicar el límite y mostrar el material identificado |
| 23–27 | Mostrar arquitectura, permisos y resultados | Explicar responsabilidades de ambos clientes y la base. Distinguir empresa/candidato evaluados de mentor, administrador y superadmin pendientes |
| 27–30 | Presentar lo observado y solicitar un piloto | Medir finalización, costo de soporte, disposición a pagar y brechas de accesibilidad. Indicar qué resta validar |

Usar dos sesiones independientes y un nombre de oferta único. Para probar denegación cruzada usar una tercera identidad autorizada de evaluación. Ante una caída, mostrar el informe local, el PDF y las capturas con su fecha y entorno. La presentación del flujo cloud como demo en vivo requiere un ensayo exitoso previo.

## Glosario y respuestas breves

**RLS** aplica reglas de acceso a cada fila en PostgreSQL. **JWT** es el token que acredita la sesión. **PostgREST** expone una API de datos sobre PostgreSQL. **APK** es el paquete instalable Android. **MAU** cuenta usuarios activos mensuales. **MRR** suma ingresos recurrentes mensuales. **ARPU** divide ingreso por usuarios activos según la definición elegida. **CAC** divide gasto de adquisición por clientes nuevos. **LTV** estima contribución durante la relación con una empresa; la fórmula simplificada depende de una baja estable.

**¿Cuánto cuesta con diez mil usuarios?** El número de usuarios por sí solo no determina la factura. En Escala se elige la fila de 10.000 activos y se cargan costos fijos, consumo incremental y soporte. Los renglones sin respaldo permanecen abiertos.

**¿Por qué esta arquitectura?** El servidor valida operaciones web. Android reutiliza la identidad y la política de fila al consultar la API de datos. La restricción de duplicado en base protege también ante dos envíos repetidos.

**¿Ya se demostró que escalará a 100.000?** Esa fila modela un escenario económico. El ensayo secuencial local mide un lote acotado. La capacidad simultánea en producción requiere una prueba distinta y observabilidad.

**¿Quiénes son los clientes?** Se definieron segmentos y un piloto propuesto. La evidencia comercial pendiente es una organización que pruebe el servicio y acepte condiciones y precio.
