# VERIFICACIÓN PRE-DESARROLLO

## Comprobado sobre este paquete

- `app.js`: sintaxis JavaScript válida.
- `sw.js`: sintaxis JavaScript válida.
- `manifest.webmanifest`: JSON válido.
- Referencias de assets del Service Worker: sin archivos faltantes.
- IDs usados por `app.js`: presentes en `index.html`.
- Navegación interna del Admin: todos los anchors tienen un destino.
- Archivos de texto revisados: UTF-8.

## Importante

Estas son verificaciones estáticas del paquete.

Antes de afirmar validación total todavía hay que ejecutar en un navegador real:

- consola sin errores;
- Service Worker activo;
- Career Passport;
- buscador;
- carrito;
- formulario B2B;
- Agenda;
- Admin;
- controles de accesibilidad;
- responsive.

No afirmar que backend, Supabase, Mercado Pago, Google Calendar/Meet,
APIs laborales o Glovta AI estén implementados: pertenecen a la siguiente etapa.
