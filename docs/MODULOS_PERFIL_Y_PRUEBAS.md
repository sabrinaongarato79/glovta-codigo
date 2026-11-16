# Glovta — módulos del perfil profesional

Actualizado: 5 de noviembre de 2026. Estado: implementación local, validación real entre cuentas aprobada. Sin despliegue público.

## Alcance implementado

Experiencia y proyectos, formación, idiomas y habilidades tienen formularios para crear, consultar, editar y eliminar. Las operaciones usan Express y el cliente de Supabase con el JWT del usuario. No hay almacenamiento ficticio en el portal ni claves privilegiadas.

La bienvenida y el acceso aparecen sin autenticar. Mi perfil profesional aparece después del login. No se precargan correo ni contraseña. Career Passport incluye los registros recuperados del servicio. Los cuatro datos básicos mantienen su indicador separado: 100 % de presentación no significa 100 % de calidad de tesis.

Guardar una sección conserva los borradores de las demás. Los errores de carga permiten reintentar por sección. El borrado requiere confirmación. Tras guardar se devuelve el foco al control de la sección. Cerrar sesión vacía los módulos y su vista previa. Los tokens viven en memoria; recargar exige volver a ingresar.

## API

Todas las rutas requieren Authorization: Bearer con una sesión verificada mediante auth.getUser.

| Método | Ruta | Comportamiento |
|---|---|---|
| GET | /api/profile-sections/:section | Consulta registros del propietario |
| POST | /api/profile-sections/:section | Crea con profile_id obtenido de la sesión |
| PUT | /api/profile-sections/:section/:id | Reemplaza campos editables; filtra por propietario e ID |
| DELETE | /api/profile-sections/:section/:id | Elimina exclusivamente el registro filtrado |

Secciones: experiences, education, languages, skills. Correspondencia con tablas en profile-model.js. PUT es reemplazo de los campos editables, no PATCH: el cliente envía el formulario completo.

Respuestas: 400 datos inválidos; 401 sesión ausente/inválida; 403 permisos insuficientes; 404 sección/registro no disponible; 409 duplicado; 422 perfil padre ausente; 502 fallo del proveedor. Los detalles internos no se devuelven al navegador.

## Validaciones y seguridad

- Campos requeridos y longitudes consistentes con la migración profesional.
- Fechas de calendario válidas, fin no anterior a inicio, sin fecha final cuando está marcado actualmente/en curso.
- Tipos de experiencia, formación, nivel y categoría enumerados.
- ID, profile_id y created_at no editables desde el cuerpo de la petición.
- Filtro del propietario en servidor y RLS en PostgreSQL como controles independientes.
- Idiomas y habilidades tienen índice único por propietario y nombre normalizado en la migración.
- Texto del usuario renderizado con textContent.
- La comprobación de RLS debe hacerse directamente contra Supabase para evitar que el filtro del servidor oculte una política defectuosa.

No se volvió a ejecutar ninguna migración. La captura aportada confirma RLS activo y cuatro políticas por tabla, pero contar políticas no demuestra su efectividad.

## Evidencias de esta etapa

| Prueba | Resultado | Límite |
|---|---|---|
| node --test | 22 aprobadas | Supabase simulado en pruebas de API |
| verify-sections.cjs | CRUD cuatro módulos, reingreso, borradores, Passport y cierre a 390/1280 px | API simulada en navegador |
| verify-profile.cjs | Progreso y guardado a 390/1280 px | API simulada |
| verify-portal.cjs | Error de configuración, limpieza de contraseña, sin desborde móvil | Servidor local sin Supabase |
| verify-anonymous.mjs | HTTP 401 en las cuatro tablas | Supabase real, usuario anónimo solamente |
| verify-rls.mjs | 13 comprobaciones aprobadas | Dos cuentas en Supabase real |

Capturas en output/qa/sections-390.png y sections-1280.png; evidencia anónima en output/qa/anonymous-real.json. La validación visual no es certificación WCAG; faltan auditoría completa y lector de pantalla.

## Repetición opcional de la prueba real

1. En Supabase, Authentication → Users → Add user → Create new user, crear dos cuentas nuevas y exclusivas para QA. Usar direcciones bajo tu control y contraseñas diferentes. No compartir contraseñas por chat. Para esta prueba administrativa, confirmar las cuentas desde el formulario.
2. Se admite un perfil existente. El verificador consulta su ID y crea un perfil de prueba solo si falta.
3. Desde PowerShell en la carpeta Glovta ejecutar: `powershell -NoProfile -File .\scripts\verify-rls.ps1`.
4. Ingresar ambos correos y contraseñas cuando lo pida; las contraseñas se ocultan y solo quedan temporalmente en el entorno del proceso.
5. El script inicia sesiones con la clave pública, crea perfiles etiquetados QA y prueba CRUD propio, persistencia después de otro login y ataques cruzados SELECT/INSERT/UPDATE/DELETE en ambas direcciones. Comprueba protección de propietario y duplicados normalizados.
6. Elimina únicamente IDs de registros generados por esa ejecución. Conserva los perfiles QA identificados; no elimina cuentas ni perfiles reales. Podés reutilizar las cuentas de prueba.
7. Revisar output/qa/rls-real.json. Solo un informe passed permite afirmar que esas comprobaciones reales pasaron. Si falla, conservar el informe y corregir antes de avanzar.

El registro web está implementado localmente. Crear cuentas desde Supabase no sustituye la prueba del registro comercial.

## Manual breve

Ingresar → completar presentación → Guardar perfil → abrir Agregar en cada sección → completar campos → Guardar registro. Editar carga el registro en el formulario. Cancelar descarta ese formulario. Eliminar pide confirmación. Career Passport refleja los registros guardados. Cerrar sesión, volver a entrar y comprobar que los datos reaparecen permite repetir la prueba manual con otra cuenta.

## Criterio para declarar los módulos terminados

- CRUD y reingreso verificados contra Supabase real.
- Ninguna cuenta puede leer, insertar, modificar o borrar datos de otra por API directa.
- Prueba manual completa de errores y navegación por teclado.
- Evidencias adjuntas y documentación consistente.

Estado: CRUD, persistencia y aislamiento comprobados directamente contra Supabase. La prueba manual de habilidades en navegador pasó. Quedan el registro público y la revisión de accesibilidad.

Prueba manual del portal local conectado a Supabase (5 de noviembre de 2026): Sabrina confirmó que, después de guardar una habilidad, cerrar sesión y volver a ingresar con la misma cuenta, la habilidad apareció en Career Passport. Evidencia: confirmación de la usuaria en el chat. Alcance: una habilidad y una cuenta existente.

Registro disponible en la bienvenida del portal local mediante Crear una cuenta. El servidor delega el alta a Supabase Auth. Pasaron 23 pruebas Node y el recorrido de formulario con API simulada. Pendiente la entrega real del correo, confirmación, primer login y guardado con la cuenta nueva.
