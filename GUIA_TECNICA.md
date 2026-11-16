# INSTRUCCIONES PARA DESARROLLO — GLOVTA

Este directorio contiene el frontend visual aprobado de:

**GLOVTA — Global Vision Talent Accelerators**
**Slogan: Talento sin fronteras**

## Regla principal

NO reemplazar este diseño por una plantilla genérica, un dashboard de UI kit, Tailwind template ni estética distinta.

Conservar:
- navy oscuro + azul eléctrico + cyan;
- estructura compacta y corporativa;
- hero tecnológico;
- navegación simple;
- exploración sin registro;
- Career Passport;
- oportunidades;
- formación propia;
- Free / Premium;
- B2B;
- accesibilidad;
- proyectos/organizaciones demo claramente etiquetados.

## Primera tarea

1. Auditar `index.html`, `styles.css`, `app.js`, `admin.html`, `manifest.webmanifest` y `sw.js`.
2. Ejecutar el frontend localmente.
3. Verificar errores de consola y referencias rotas.
4. Corregir solo errores reales.
5. No cambiar el diseño ni el copy sin pedir aprobación.
6. No hacer commits todavía.

## Segunda etapa, solo después de aprobación

Convertir este frontend en un MVP comercial conectando:
- Node.js + Express 5;
- Supabase PostgreSQL + Auth + RLS;
- productos, órdenes y accesos;
- leads B2B;
- providers de oportunidades permitidos;
- Mercado Pago desde backend;
- Glovta AI opcional y con límites;
- Firebase solo para Analytics/notificaciones si se decide usarlo.

## Reglas de verdad y seguridad

- No inventar clientes, métricas, APIs ni integraciones.
- No afirmar WCAG AA/AAA sin auditoría.
- ESSA no forma parte de GLOVTA.
- Secretos solo en backend.
- Nunca confiar en precios enviados por el navegador.
- Si una API no está configurada, usar fallback/demo explícito.


## Agenda / Calendar / Meet

El frontend incluye una agenda funcional en modo demo.

Antes de modificarla:
- verificar cambio de mes;
- seleccionar una fecha futura;
- reservar horario;
- verificar persistencia;
- abrir Admin y comprobar que la reunión aparezca.

En producción implementar:
- tabla `appointments`;
- disponibilidad;
- validación en backend;
- Google OAuth;
- Google Calendar;
- creación de Google Meet desde servidor;
- almacenamiento seguro de tokens;
- cancelación / reprogramación;
- recordatorios.

Nunca inventar URLs de Meet ni exponer tokens OAuth en frontend.
