# Ampliación de la base del perfil
Estado: script local preparado, pendiente de ejecución y pruebas SQL en Supabase.

El archivo 202611050001_professional_profile.sql agrega cinco columnas opcionales de objetivo y preferencias a profiles y cuatro tablas dependientes para experiencia, formación, idiomas y habilidades. Los perfiles existentes reciben valores vacíos para los nuevos campos. El script se ejecuta una vez dentro de una transacción.

Cada tabla nueva tiene propietario obligatorio, clave foránea a profiles, RLS y cuatro políticas por auth.uid. La identidad, el propietario y la fecha de creación no admiten actualización por clientes. Los insert de cliente solo admiten propietario y campos editables. Los idiomas y habilidades no pueden duplicarse para el mismo dueño ignorando mayúsculas y espacios extremos.

Las experiencias incluyen empleo, trabajo independiente, proyectos académicos y personales, y voluntariado. No se obliga a tener experiencia formal. Los registros con fecha final requieren inicio anterior o igual; los registros actuales tienen fecha final vacía.

Validación posterior requerida: confirmar columnas y políticas, crear registros con una cuenta de evaluación, comprobar lectura y edición propia, rechazar acceso cruzado usando una segunda cuenta y verificar restricciones de fechas y duplicados. Después conectar API y formularios. Este cambio de esquema por sí solo no implementa la interfaz ampliada.

El permiso de eliminar se limita a registros propios de las cuatro tablas nuevas. La operación de migración no elimina registros existentes.
