# Backend GLOVTA — primera etapa

Preparado localmente. No conectado ni desplegado. El frontend conserva sus demos.

## Inicio

1. Ejecutar `npm install` (Node 22.14 o superior).
2. Copiar `.env.example` a `.env` y completar la URL y la clave **publicable** de Supabase. Nunca usar una clave secret/service_role: estas rutas deben respetar RLS.
3. Aplicar el esquema según `supabase/README.md` a un proyecto nuevo.
4. Ejecutar `npm start` y abrir http://127.0.0.1:8080.
5. Ejecutar `npm test` para las pruebas locales.

Sin configuración, la web demo funciona y las rutas de datos responden 503.

## API

- `GET /api/health`: disponibilidad local y presencia de configuración, sin afirmar conexión remota.
- `GET /api/opportunities`: hasta 100 oportunidades publicadas; RLS excluye vencidas.
- `GET /api/profile`: perfil propio o null.
- `PUT /api/profile`: nombre completo requerido; headline, location y bio opcionales. Reemplaza estos campos del perfil propio.
- `GET /api/applications`: últimas 100 postulaciones propias.
- `POST /api/applications`: opportunity_id UUID y cover_note opcional. La identidad procede de la sesión validada; no acepta estados ni identidades del navegador.

Las rutas privadas requieren `Authorization: Bearer <access_token>` emitido por Supabase Auth. Cada petición crea un cliente sin persistir sesiones y transmite ese token para aplicar RLS. No hay registro/login visual todavía. El Admin existente sigue siendo demo local.

## Pendiente antes de uso público

Configurar Supabase y ejecutar pruebas con dos usuarios reales de `supabase/README.md`; implementar registro/login y conectar el Career Passport respetando sus campos actuales; añadir límites de tráfico, recuperación de sesión y observabilidad antes de exponer escrituras. Consultas B2B, agenda, pagos, correo y Meet continúan pendientes. No hay commits ni despliegue.

Las pruebas automatizadas usan respuestas simuladas de Supabase: verifican HTTP, identidad y errores del backend, pero no certifican las políticas remotas.
