# Glovta · Verificación del espacio profesional

| Funcionalidad | Estado | Evidencia y alcance |
|---|---|---|
| Navegación, borradores y preferencias | Aprobada en navegador local | Se probaron enlaces, activación por teclado, vuelta atrás, cambio de sección con un borrador y guardado del objetivo conservando el nombre. |
| Experiencia, formación, idiomas y habilidades | Aprobada en interfaz con API de prueba | Crear, editar, eliminar, volver a ingresar, recuperar los registros y reintentar una lectura fallida. |
| Persistencia y seguridad por fila en Supabase | Aprobada en la ejecución real registrada | 13 verificaciones en el informe de dos cuentas. Comprende datos propios tras un nuevo inicio de sesión, operaciones cruzadas y acceso anónimo sobre las cuatro tablas de trayectoria. |
| Nueva ejecución de la interfaz rediseñada con sesiones reales | Bloqueada por acceso | Las credenciales QA se ingresan localmente. La prueba de base y la prueba de interfaz son evidencias separadas. |
| Passport e impresión | Aprobada para perfil corto | Objetivo recuperado, habilidades por categoría, datos guardados, PDF A4 generado. Falta revisar un perfil de varias páginas. |
| Accesibilidad y adaptación | Aprobada en controles automatizados; aceptación manual pendiente | Edge a 390, 768 y 1280 px. Axe sobre cinco vistas por tamaño. Activación por teclado, ausencia de desborde horizontal y consola sin errores en el recorrido satisfactorio. Pendiente lector de pantalla y teléfono físico. |
| Oportunidades y postulaciones | Aprobada con datos de prueba | Búsqueda con y sin coincidencias, postulación, botón de duplicado deshabilitado, seguimiento y vuelta atrás. |
| Postulación real de demostración | Bloqueada por falta de oferta de evaluación | La consulta pública al catálogo de oportunidades publicadas respondió HTTP 200 con cero filas visibles. Se necesita una oferta autorizada y una cuenta de evaluación. |

Los informes reproducibles están en `output/qa/rls-real.json` y `output/qa/espacio-profesional.json`. La verificación de interfaz usa registros ficticios. Para repetir la auditoría automatizada de accesibilidad, ejecutar `scripts/verify-workspace.cjs` con Playwright disponible y `AXE_SCRIPT` apuntando a axe.min.js (axe-core 4.10.3).

## Requisitos para cerrar la entrega

1. Verificar registro, acceso, guardado, reingreso y postulación con cuentas de evaluación desde la interfaz web. Registrar roles permitidos y denegados.
2. Instalar el APK en un dispositivo limpio, verificar los flujos acordados y vincular la versión probada con su código fuente.
3. Completar manuales y videos separados de web y Android. Probar enlaces y accesos desde una sesión limpia con los permisos del tribunal.
4. Conciliar alcance, requisitos, casos de uso y prueba, DER, clases, arquitectura, componentes y Gantt con la versión entregada. Documentar también la propuesta comercial y el uso verificable de IA.
5. Completar PL03, responsables y portada, y ensayar los 30 minutos de defensa con el equipo. El detalle institucional se conserva en `CONTROL_ENTREGA_TESIS.md`.
