# Entrega del rediseño GLOVTA

## Ubicación
C:\Users\LENOVO\Documents\ChatGPT\Glovta
Original conservado en Downloads\GLOVTA_Entrega_Final. Sin commits ni instalaciones.

## Implementado
- Hero editorial con imagen generada, texto HTML y llamadas a la acción.
- Logo vectorial propio GLOVTA y variantes de iconos. Exclusividad registral no comprobada.
- Mensaje inclusivo y controles A− / A / A+ visibles en móvil.
- Recorridos desplegables para acortar la portada sin eliminar las demos.
- Propuestas para inmobiliarias, comercios y gestión financiera.
- Oferta adicional de ecommerce, automatización, webs accesibles y reportes.
- Selección automática del servicio al acceder desde una tarjeta comercial.
- Sin clientes ficticios ni referencia comercial a ESSA.

## Pruebas realizadas
- Sintaxis app.js y sw.js: válida.
- Manifest: parseo JSON válido.
- IDs, anchors y precache: sin referencias faltantes.
- Escritorio 1440 px y móvil 390 px: inspección visual. Sin desborde horizontal del documento; tarjetas dentro del ancho móvil; agenda en una columna móvil.
- Menú móvil: apertura verificada.
- A+: escala 1.05 verificada; A: retorno a 1.00 verificado; alto contraste: clase activada verificada. No se certifica conformidad WCAG.
- CTA oportunidades abre sección; búsqueda SQL devuelve 3 resultados demo.
- Passport abre y avanza al segundo paso; no se certificó guardado completo.
- Carrito agrega SQL con total $24.900 y permite retirarlo (contador 0).
- Tarjeta Comercios conduce a contacto y preselecciona Comercios.
- Consola: sin errores capturados durante estos recorridos.

## Límites pendientes
Contacto, reservas y perfiles siguen siendo demos locales. No hay backend, autenticación, envíos de email, pagos, Calendar/Meet ni Supabase. No se certificaron offline, instalación PWA, lectores de pantalla ni todos los flujos demo de punta a punta. Los problemas de validación de datos identificados en la auditoría previa requieren una etapa específica de robustecimiento antes de producción.

## Secuencia recomendada
1. Definir dominio, contacto comercial y repositorio; publicar frontend tras autorización.
2. Conectar consultas y reservas reales a Supabase, con validación y permisos.
3. Implementar Admin autenticado y definir política de datos.
4. Incorporar pagos e IA solo después de definir productos, alcance y operación.

## Imagen del hero
Herramienta: image_gen integrada. Archivo: assets/hero-global.png.
Prompt empleado:
Use case: ads-marketing. Create a premium photographic website hero background, very wide landscape. Global talent and technology brand GLOVTA. No text, no lettering, no logos, no UI. Left 55 percent quiet deep midnight navy negative space for HTML headline. Right side: confident young adult Latin American businesswoman with naturally curly dark hair, dark tailored blazer, holding a closed silver laptop, looking ahead optimistically. Behind her a large luminous blue globe with delicate cyan interconnected network paths and realistic continent shapes. Sophisticated glass financial district at blue hour, restrained cinematic lighting, electric blue and navy palette. Editorial global corporate campaign, natural human skin texture, polished but not stock-photo handshake aesthetic. Composition crop waist up, head fully in frame, subject occupies right third. Image used behind live readable website text.
