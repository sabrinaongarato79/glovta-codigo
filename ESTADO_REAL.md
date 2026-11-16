# ESTADO REAL — GLOVTA

## Implementado en este paquete

- Frontend responsive con identidad GLOVTA.
- Career Passport demo con persistencia en localStorage.
- Buscador demo con datos mock y enlaces externos.
- Catálogo propio y carrito demo.
- Formulario B2B demo.
- Agenda demo con reserva local.
- Panel Admin demo para métricas locales, leads y reuniones.
- Secciones placeholder de Usuarios, Productos y Pedidos (sin afirmar funcionalidad real).
- Accesibilidad básica implementada:
  - skip link;
  - foco visible;
  - A− / A / A+;
  - alto contraste;
  - prefers-reduced-motion.
- PWA básica:
  - manifest.webmanifest;
  - Service Worker;
  - iconos 192x192, 512x512 y SVG.

## No implementado todavía

- Conexión y despliegue del backend Express 5 (base local preparada).
- Supabase PostgreSQL.
- Supabase Auth / RLS.
- Mercado Pago real.
- Google Calendar / Google Meet real.
- APIs laborales reales.
- Glovta AI real.
- Pruebas remotas de Supabase y pruebas completas de la interfaz conectada.

## Avance local — 14/10/2026

- Backend Express 5 preparado para oportunidades, perfil propio y postulaciones.
- Validación de sesión Supabase y transmisión del token para respetar RLS.
- Configuración mediante `.env`; sin credenciales ni conexión remota.
- Cinco pruebas automatizadas locales aprobadas; Supabase simulado, sin validar RLS real.
- Frontend y Admin siguen en modo demo; diseño conservado.
- Service Worker excluye `/api/` para evitar cachear datos privados.
- Inicio y pendientes documentados en `server/README.md`.

## Verificación local — 03/11/2026

- 8 pruebas de backend aprobadas con Supabase simulado.
- 13 escenarios web aprobados en Edge y repetidos en Chrome.
- Corregidos fallos de almacenamiento bloqueado/lleno, validación de reservas, recuperación del Passport y contadores de Admin con datos inválidos.
- Evidencia, comandos y límites en `INFORME_PRUEBAS.md`. Esta verificación no acredita APK ni integraciones remotas.

## Regla de evidencia

No afirmar en una defensa, README o demo que una integración está implementada
si todavía es demo, mock, localStorage o una etapa planificada.
