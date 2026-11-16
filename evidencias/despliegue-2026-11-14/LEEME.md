# Evidencia de despliegue — 14/11/2026

Dos informes generados por Codex, copiados sin cambios.

| Archivo | Qué comprobó | Límite declarado en el propio informe |
|---|---|---|
| `verificacion-paquete.json` | Paquete local aislado (14/11, 22:26 hora Argentina): 14 comprobaciones, entre ellas que rechaza otro proyecto y una clave no publicable (503), y que `/.env`, `/server/app.js` y `/package.json` devuelven 404 | Servidor local. No acredita el build remoto en Vercel ni un recorrido autenticado público |
| `verificacion-publica.json` | `https://glovta-evaluacion.vercel.app` (14/11, 23:09 hora Argentina): `/portal.html` 200, `/api/health` 200 con `supabaseConfigured: true`, `/api/profile` y `/api/employer` 401 sin sesión, `/.env` y `/server/app.js` 404 | Comprobación HTTP sin sesiones. No acredita el recorrido autenticado |

## Relación con el código (verificada el 15/11/2026)
Los hashes SHA-256 del manifiesto del paquete publicado (`GLOVTA_portal_evaluacion_20261114_222638`) coinciden con los archivos del commit de la rama `handoff-2026-11-15`: 13 archivos idénticos y 7 que difieren solo en los saltos de línea de Windows (mismo contenido).
Esto vale si el paquete subido a Vercel es ese. Las variables del proyecto en Vercel (`SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `GLOVTA_EMPLOYER_ENABLED`) existen en Production; sus valores no se revisaron.

Estado: DECLARADO por los informes; los puntos anteriores fueron contrastados con los archivos, no con una nueva consulta a la URL pública.
