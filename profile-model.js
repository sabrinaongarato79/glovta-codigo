export const profileSections = {
  experiences: { title: 'Experiencia y proyectos', table: 'profile_experiences', fields: {
    position: ['Puesto o proyecto', 150, true],
    organization: ['Empresa u organización', 200, true],
    experience_type: ['Tipo de experiencia', ['employment','freelance','academic','volunteer','personal'], true],
    start_date: ['Fecha de inicio', 'date'], end_date: ['Fecha de finalización', 'date'],
    is_current: ['Actualmente', 'boolean'], achievements: ['Responsabilidades y logros', 3000]
  }},
  education: { title: 'Formación', table: 'profile_education', fields: {
    title: ['Título o curso', 200, true], institution: ['Institución', 200, true],
    education_type: ['Tipo de formación', ['academic','certification','course','training'], true],
    start_date: ['Fecha de inicio', 'date'], end_date: ['Fecha de finalización', 'date'],
    is_current: ['En curso', 'boolean'], description: ['Descripción', 2000]
  }},
  languages: { title: 'Idiomas', table: 'profile_languages', fields: {
    language: ['Idioma', 80, true], proficiency: ['Nivel', ['basic','intermediate','advanced','native'], true]
  }},
  skills: { title: 'Habilidades', table: 'profile_skills', fields: {
    name: ['Habilidad', 100, true], category: ['Categoría', ['technical','interpersonal','digital'], true]
  }}
};
export const profileLabels = {
 employment:'Empleo', freelance:'Trabajo independiente', academic:'Académico', volunteer:'Voluntariado',
 personal:'Proyecto personal', certification:'Certificación', course:'Curso', training:'Capacitación',
 basic:'Básico', intermediate:'Intermedio', advanced:'Avanzado', native:'Nativo',
 technical:'Técnica', interpersonal:'Interpersonal', digital:'Digital'
};
export function validateSection(section, body) {
  const spec = profileSections[section];
  if (!Object.hasOwn(profileSections, section) || !body || typeof body !== 'object' || Array.isArray(body) ||
      Object.keys(body).some(key => !Object.hasOwn(spec.fields, key))) throw new Error('Campos no permitidos.');
  const values = {};
  for (const [key, [label, type, required]] of Object.entries(spec.fields)) {
    const value = body[key];
    if (type === 'boolean') {
      if (value !== undefined && typeof value !== 'boolean') throw new Error(label + ' inválido.');
      values[key] = value ?? false;
    } else if (type === 'date') {
      if (value === '' || value == null) { values[key] = null; continue; }
      if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
          !Number.isFinite(Date.parse(value)) || new Date(value).toISOString().slice(0,10) !== value) throw new Error(label + ' inválida.');
      values[key] = value;
    } else {
      if (typeof (value ?? '') !== 'string') throw new Error(label + ' inválido.');
      const text = (value ?? '').trim();
      if ((required && !text) || (Array.isArray(type) ? !type.includes(text) : text.length > type)) throw new Error('Revisá ' + label.toLowerCase() + '.');
      values[key] = text;
    }
  }
  if (values.end_date && (!values.start_date || values.end_date < values.start_date || values.is_current)) throw new Error('Revisá las fechas y el estado actual.');
  return values;
}
