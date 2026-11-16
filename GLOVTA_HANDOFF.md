# GLOVTA — HANDOFF Codex → Claude

Fecha: 2026-11-15 (domingo, ~21:30, Buenos Aires)
Preparado por: Claude, leyendo el repositorio en modo solo lectura. Codex no pudo escribirlo: su cupo se restablece el 18/11 a las 20:25.
Proyecto: GLOVTA — Global Knowledge & Talent Accelerator (nombre aún sin unificar, ver más abajo).

## 1. Cómo leer este archivo
- VERIFICADO = lo comprobé yo en el repositorio de esta fecha.
- DECLARADO = lo informó Codex o la estudiante; sin evidencia revisada por mí.
- NO VERIFICADO = no tengo evidencia ni de una cosa ni de la otra.
No hay credenciales en este archivo. Solo nombres de variables.

## 2. Repositorio
- Ruta: C:\Users\LENOVO\Documents\ChatGPT\Glovta
- Rama de Codex: codex/cierre-android-2026-11-12
- Único commit anterior: 29a0926 "Conservar versión local evaluable de Glovta web y Android"
- Remoto: ninguno (VERIFICADO: `git remote -v` vacío). Sin push realizado.
- Antes del commit de este handoff, todo el trabajo del 9 al 15/11 estaba SIN confirmar en Git (10 archivos modificados y ~69 sin seguimiento).
- Punto de retorno seguro: el commit 29a0926 (versión del 8/11).
- Rama de este handoff: handoff-2026-11-15 (commit propio; no incluye .env*, tmp/, outputs/, output/, APK, zips ni pptx).
- .env y .env.qa existen en la carpeta y están ignorados por Git (VERIFICADO). No se abrieron.

## 3. Arquitectura (VERIFICADO en código)
Web estática (HTML/CSS/JS sin framework) + Node >=22.14 con Express 5 + Supabase Auth + PostgreSQL con RLS + Android nativo Java. No migrar.

## 4. Lo que Codex dejó preparado (VERIFICADO que existe; no se ejecutó)
- scripts/prepare-evaluation-deploy.mjs: arma output/deploy/ con lista explícita de archivos, genera api/index.js y vercel.json, aborta si ve sb_secret_, service_role o la referencia de producción, y el handler responde 503 si SUPABASE_URL no es el proyecto de evaluación.
- scripts/verify-deployment-package.mjs, scripts/start-qa.mjs (puerto 8081, rechaza producción), scripts/run-evaluation.*, scripts/build-android-qa.mjs, scripts/verify-web-android-profile.cjs, scripts/verify-accessibility-essential.cjs, scripts/reset-company-qa-password.(mjs|ps1).
- android/app/build.gradle: modo QA (GLOVTA_ANDROID_QA=true) solo acepta URL del proyecto de evaluación y clave publicable; agrega sufijo "-qa" a la versión.

## 5. Estado declarado (NO sustituye evidencia)
- Entorno de evaluación: proyecto Supabase yecgzorcxkokanuxgwki (único autorizado). Producción: elgtdvgddukmzqthztbo — NO tocar.
- Recorrido empresa → oferta → postulación → revisión → aceptación → reingreso: DECLARADO aprobado el 12/11. Hay 4 capturas del 15/11 en evidencias/recorrido-web-2026-11-15/ (VERIFICADO que existen). Su LEEME dice que no acredita negativos ni seguridad completa, y que no se identificó el commit del despliegue.
- 13 comprobaciones de trayectoria y aislamiento: DECLARADO aprobado (12/11). No equivale a auditar las 27 políticas RLS.
- Android en Galaxy A22: instalación, acceso, perfil, contraseña incorrecta, pérdida y recuperación de red, TalkBack leyó "Cerrar sesión": DECLARADO. En tmp/ hay volcados de pantalla (glovta-error-password*.xml, glovta-negative.xml, glovta-network-*.xml) que parecen respaldarlo; NO los revisé.
- Alcance Android real: iniciar sesión, consultar el perfil, cerrar sesión. No edita perfil ni lista ofertas ni postula.
- Portal público: evidencias/.../LEEME.md menciona https://glovta-evaluacion.vercel.app/portal.html. NO VERIFICADO que responda hoy, ni que /api funcione, ni desde qué commit. No existe vercel.json en la raíz del repo (se genera dentro de output/deploy/).

## 6. Pendientes (ver hoja "Auditoría Glovta 13-11" en la cuenta de la estudiante)
P0:
1. Nombre único: PL03 y PDF dicen "Global Vision Talent Accelerators"; portal.html dice "Global Knowledge and Talent Accelerator"; el nombre de trabajo es "Global Knowledge & Talent Accelerator". Decisión de la estudiante. Si no está tomada, preguntar.
2. 10 casos negativos de seguridad en evaluación (permisos por rol, aislamiento, transiciones inválidas, duplicados, anónimo, token inválido, cuerpo >16 kb, auto-membresía).
3. Verificar destino de la APK -qa (debe contener solo yecgz…), registrar versión y SHA-256 del archivo instalado.
4. Portal público: probar desde otra red /api/health, 401 sin token, recorrido completo; registrar URL, commit y fecha.
5. Actualizar PL03 v5 / PDF / manual web con estados reales y enlaces comprobados. El PL03 v5 NO está en este repo (solo docs/PL03_Glovta_borrador.docx, versión vieja).
6. Registrar en el Acta el cambio de tecnologías frente a la propuesta original (Java/Spring, React, MySQL, Firebase, OpenAI → Express, JS sin framework, Supabase).
Decisión pendiente de la estudiante/tutor: alcance Android (editar perfil, ofertas, postulaciones) y 13 funciones originales vs 6 historias del MVP. Registrar como discrepancia, sin bloquear tareas documentales.

## 7. Reglas vigentes
- Solo el proyecto de evaluación. No modificar producción.
- Sin push, despliegue, migraciones ni cambios de credenciales sin autorización explícita.
- No `git add .`; agregar por ruta revisada.
- No exponer contraseñas, tokens ni claves en chat, logs o archivos versionados.
- No marcar PASS sin ejecución y evidencia. Estados: PASS, FAIL, BLOCKED, NOT RUN.

## 8. Variables de entorno (solo nombres)
SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, GLOVTA_EMPLOYER_ENABLED, GLOVTA_ANDROID_QA, PORT, HOST.

## 9. Próxima tarea recomendada
1. Confirmar con la estudiante si el portal en Vercel responde hoy y desde qué commit.
2. Ejecutar los 10 negativos de seguridad y registrar PASS/FAIL con proyecto, commit y fecha.
3. Verificar y registrar SHA-256 y destino de la APK -qa.
