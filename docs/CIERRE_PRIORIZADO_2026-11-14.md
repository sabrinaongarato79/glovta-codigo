# Estado de cierre de Glovta

Fecha local: 14 de noviembre de 2026, America/Buenos_Aires.
Objetivo interno: 16 de noviembre. Presentacion prevista: 18 de noviembre.

Se incorporan los protocolos ejecutivo y academico recibidos sin reiniciar el proyecto.
La distribucion documentacion 4, producto 4 y defensa 2 es una referencia comunicada
por la estudiante, no una rubrica institucional verificada ni una calificacion.

## Version de trabajo

- Rama: codex/cierre-android-2026-11-12.
- Commit base: 29a09264181bdd27af6708fc90b685ef826fd1ea.
- Existen cambios locales sin commit: el commit base no identifica por si solo el paquete actual.
- El paquete de publicacion registra hashes de los archivos fuente en manifest-source.json.
- No se realizaron push ni despliegue publico durante la preparacion del paquete.

## Resultado tecnico disponible

| Elemento | Estado | Evidencia o limite |
|---|---|---|
| Regresion automatizada existente | PASS, 23 pruebas | npm test; no sustituye RLS remota |
| Paquete web y API | PASS local, 14 comprobaciones | ../output/deploy/verificacion-paquete.json |
| Portal publico | FALLA en URL revisada | /portal.html y /api/health devolvieron 404 |
| Perfil web recuperado en A22 | PASS | ../output/android-evaluacion/web-android-persistencia-verificada.json |
| Clave incorrecta y reingreso Android | PASS | ../output/android-evaluacion/a22-clave-incorrecta.json |
| Sin conexion y recuperacion Android | PASS | ../output/android-evaluacion/a22-prueba-conexion.json |
| TalkBack | Parcial | ../output/android-evaluacion/talkback-a22-observacion.json; lectura del boton confirmada por usuaria |
| Seguridad negativa completa | NOT RUN | No extrapolar los casos aprobados a todas las politicas |
| PL03 oficial recibido | Incompleto | Plantilla vacia; documentos previos requieren consolidacion |

## Proxima accion concreta

Publicar el paquete revisado en un proyecto de alojamiento separado, solo con Supabase
yecgzorcxkokanuxgwki. Se requiere acceso a la cuenta y autorizacion explicita antes
del despliegue, segun los protocolos aportados. Validar build remoto y circuito publico;
el exito local no acredita que Vercel ya funcione.

Reversion: conservar el sitio de presentacion actual; retirar o revertir el despliegue
del nuevo proyecto si falla, sin cambiar base de datos, RLS ni produccion.

## Orden de cierre

1. Portal publico y API con evidencia externa.
2. Conciliar alcance real web/Android y version APK; no repetir pruebas sin cambios.
3. Seguridad negativa y accesibilidad pendientes.
4. Manuales, trazabilidad, diagramas, repositorios, videos, PL03 y PDF institucional.
5. Version estable identificada y ensayo de defensa.

Android permite autenticacion, consulta de perfil y cierre de sesion. No permite editar
perfil ni consultar ofertas. Las diferencias frente al alcance comprometido deben
quedar explicitadas; no se presume una aprobacion docente del alcance reducido.

No se agregan IA, LSA automatizada, CRM, pagos, nuevos modulos comerciales ni redisenos
completos. Los aportes por materia y la defensa se vincularan a evidencias existentes,
sin inventar funciones para cubrir asignaturas.
