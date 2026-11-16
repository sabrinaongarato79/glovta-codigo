import {profileSections, profileLabels} from './profile-model.js';
const select = id => document.getElementById(id);
let session = null;
let refreshing = null;
let generation = 0;
let savedProfile = {};
let employerName = '';
const counts = new Map();
const viewTitles = {overview:'Mi espacio', profile:'Mi perfil', passport:'Career Passport', 'jobs-section':'Oportunidades', 'applications-section':'Mis postulaciones'};
function showView(focus = false) {
  if (!session) return;
  const hash = location.hash.slice(1);
  const section = Object.keys(profileSections).some(key => hash === 'section-' + key);
  const preferences = hash === 'preferences';
  const view = section || preferences ? 'profile' : Object.hasOwn(viewTitles, hash) ? hash : 'overview';
  for (const id of ['overview','passport','jobs-section','applications-section']) select(id).hidden = id !== view;
  select('profile').hidden = view !== 'profile' || section;
  select('profile').classList.toggle('preferences-only', preferences);
  select('preferences').open = preferences;
  select('edit-nav').hidden = view !== 'profile';
  select('professional-sections').hidden = !section;
  for (const panel of select('professional-sections').children) panel.hidden = panel.id !== hash;
  select('jobs-nav').hidden = !['jobs-section','applications-section'].includes(view);
  select('employer-panel').hidden = !(employerName && view === 'jobs-section');
  select('view-heading').textContent = viewTitles[view];
  document.title = viewTitles[view] + ' · Glovta';
  for (const link of document.querySelectorAll('.section-nav a,.subnav a')) {
    const target = link.hash.slice(1);
    const active = link.closest('.section-nav') ? target === (view === 'applications-section' ? 'jobs-section' : view) : target === (hash || view);
    if (active) link.setAttribute('aria-current','page'); else link.removeAttribute('aria-current');
  }
  if (focus) {
    select('view-heading').tabIndex = -1;
    select('view-heading').focus({preventScroll:true});
    window.scrollTo(0,0);
  }
}
window.addEventListener('hashchange', () => showView(true));
function message(text) {
  const status = select('status');
  const login = select('login');
  if (login.hidden) {
    select('workspace').before(status);
  } else {
    login.querySelector('button[type=submit]').after(status);
  }
  status.textContent = text;
  if (text !== 'Procesando…') status.scrollIntoView({ block: 'nearest' });
}
function clearSession() {
  generation++;
  session = null;
  select('workspace').hidden = true;
  select('logout').hidden = true;
  select('login').hidden = false;
  select('access-layout').hidden = false;
  select('profile-heading').hidden = true;
  document.title = 'Acceso · Glovta';
  select('profile').reset();
  savedProfile = {};
  counts.clear();
  employerName = '';
  select('employer-offer').reset();
  select('employer-inbox').replaceChildren();
  updatePreview();
  select('save-state').textContent = 'Los cambios se guardan al confirmar.';
  select('professional-sections').replaceChildren();
  select('passport-sections').replaceChildren();
  select('access-password').type = 'password';
  select('toggle-password').textContent = 'Mostrar';
  select('toggle-password').setAttribute('aria-pressed', 'false');
  select('opportunities').replaceChildren();
  select('job-search').value = '';
  select('applications').replaceChildren();
}
async function request(path, options = {}, retry = true) {
  const current = generation;
  const response = await fetch('/api' + path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(session ? { Authorization: 'Bearer ' + session.access_token } : {}) },
    signal: AbortSignal.timeout(20000)
  }).catch(error => {
    if (error instanceof TypeError) throw new Error('No se pudo conectar con Glovta. Revisá tu conexión y volvé a intentar.');
    throw error;
  });
  let data;
  try { data = await response.json(); } catch { throw new Error('El servicio devolvió una respuesta inválida.'); }
  if (current !== generation) throw new Error('La sesión cambió.');
  if (response.status === 401 && session && retry) {
    if (!refreshing) refreshing = request('/auth/refresh', { method: 'POST', body: JSON.stringify({ refresh_token: session.refresh_token }) }, false)
      .then(value => { session = value; }).finally(() => { refreshing = null; });
    try { await refreshing; } catch { clearSession(); throw new Error('Tu sesión venció. Volvé a ingresar.'); }
    return request(path, options, false);
  }
  if (!response.ok) throw new Error(data.error || 'No se pudo completar la operación.');
  return data;
}
async function perform(button, action) {
  button.disabled = true;
  message('Procesando…');
  try { await action(); } catch (error) { message(error.name === 'TimeoutError' ? 'La conexión demoró demasiado. Intentá nuevamente.' : error.message); }
  finally { button.disabled = false; }
}
let registering = false;
function setAccessMode(createAccount) {
  registering = createAccount;
  const form = select('login');
  form.querySelector('h2').textContent = registering ? 'Creá tu cuenta en Glovta' : 'Bienvenido a Glovta';
  const password = form.elements.password;
  password.value = '';
  password.type = 'password';
  password.autocomplete = registering ? 'new-password' : 'current-password';
  password.minLength = registering ? 12 : 1;
  password.maxLength = registering ? 128 : 1024;
  form.querySelector('label[for="access-password"]').textContent = registering ? 'Contraseña (12 a 128 caracteres)' : 'Contraseña';
  select('toggle-password').textContent = 'Mostrar';
  select('toggle-password').setAttribute('aria-pressed', 'false');
  form.querySelector('button[type=submit]').textContent = registering ? 'Registrar cuenta' : 'Ingresar';
  select('access-mode').textContent = registering ? 'Ya tengo cuenta' : 'Crear una cuenta';
  select('status').textContent = '';
  form.elements.email.focus();
}
select('access-mode').onclick = () => setAccessMode(!registering);
select('login').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  perform(form.querySelector('button[type=submit]'), async () => {
    if (registering) {
      select('access-mode').disabled = true;
      try {
        const body = JSON.stringify(Object.fromEntries(new FormData(form)));
        const result = await request('/auth/register', { method: 'POST', body });
        setAccessMode(false);
        message(result.message);
      } finally {
        form.elements.password.value = '';
        select('access-mode').disabled = false;
      }
      return;
    }
    try { session = await request('/auth/login', { method: 'POST', body: JSON.stringify(Object.fromEntries(new FormData(form))) }); }
    finally { form.elements.password.value = ''; }
    select('login').hidden = true;
    select('access-layout').hidden = true;
    select('profile-heading').hidden = false;
    document.title = 'Mi perfil profesional · Glovta';
    select('workspace').hidden = false;
    select('logout').hidden = false;
    showView();
    const profile = await request('/profile');
    savedProfile = profile || {};
    for (const name of ['full_name', 'headline', 'location', 'bio', 'career_goal', 'work_mode', 'work_schedule', 'sectors', 'opportunity_types']) formProfile.elements[name].value = profile?.[name] || '';
    updatePreview();
    const sectionsLoaded = await loadSections();
    await load();
    const membership = await request('/employer');
    employerName = membership?.company_name || '';
    if (employerName) {
      select('employer-name').textContent = employerName;
      showView();
      await loadEmployerInbox();
    }
    if (!sectionsLoaded) message('Algunas secciones no pudieron cargarse. Usá Reintentar en la sección correspondiente.');
  });
});
const formProfile = select('profile');
function updatePreview() {
  const fields = ['full_name', 'headline', 'location', 'bio'];
  const values = fields.map(name => (savedProfile[name] || '').trim());
  const percent = values.filter(Boolean).length * 25;
  select('completion').value = percent;
  select('completion-label').textContent = percent + ' % completo';
  const recommendations = ['Agregá tu nombre para identificar tu perfil.', 'Contá tu especialidad en el titular profesional.', 'Indicá tu ciudad y país.', 'Escribí una breve presentación sobre vos.'];
  const missing = values.findIndex(value => !value);
  select('next-step').textContent = missing < 0 ? 'Tu presentación inicial está completa.' : recommendations[missing];
  select('preview-name').textContent = values[0] || 'Tu nombre';
  select('preview-headline').textContent = values[1] || 'Tu especialidad o próximo objetivo';
  select('preview-location').textContent = values[2];
  select('preview-bio').textContent = values[3] || '';
  select('overview-name').textContent = values[0] || 'Tu presentación';
  select('overview-title').textContent = values[1] || 'Sumá tu especialidad en Mi perfil.';
  select('goal-value').textContent = savedProfile.career_goal || '';
  select('goal-block').hidden = !savedProfile.career_goal;
  const total = select('total-progress');
  const ready = Object.keys(profileSections).every(key => Number.isInteger(counts.get(key)));
  select('print-passport').disabled = !ready;
  select('print-passport').title = ready ? '' : 'Esperá a que carguen las cuatro secciones.';
  if (!ready) {
    total.removeAttribute('value');
    select('total-label').textContent = 'Pendiente de verificar';
    select('total-next').textContent = 'El total requiere cargar las cuatro secciones de trayectoria.';
    select('total-action').href = '#profile';
    select('total-action').textContent = 'Revisar mi perfil';
    return;
  }
  const steps = [
    ...values.map(value => [value,'Completar presentación','#profile']),
    [savedProfile.career_goal,'Definir mi objetivo','#preferences'],
    [counts.get('experiences') || counts.get('education'),'Sumar formación o un proyecto','#section-education'],
    [counts.get('languages'),'Agregar un idioma','#section-languages'],
    [counts.get('skills'),'Agregar una habilidad','#section-skills']
  ];
  const done = steps.filter(([value]) => value).length;
  total.value = done;
  select('total-label').textContent = Math.round(done / steps.length * 100) + ' % completo';
  select('total-next').textContent = done + ' de 8 datos registrados.';
  const next = steps.find(([value]) => !value);
  select('total-action').textContent = next?.[1] || 'Ver Career Passport';
  select('total-action').href = next?.[2] || '#passport';
}
formProfile.addEventListener('input', () => {
  select('save-state').textContent = 'Tenés cambios sin guardar.';
});
updatePreview();
formProfile.addEventListener('submit', event => {
  event.preventDefault();
  perform(formProfile.querySelector('button'), async () => {
    const submitted = Object.fromEntries(new FormData(formProfile));
    await request('/profile', { method: 'PUT', body: JSON.stringify(submitted) });
    savedProfile = submitted;
    updatePreview();
    select('save-state').textContent = 'Perfil guardado.';
    message('Perfil guardado en el servicio.');
  });
});
function paragraph(text) { const node = document.createElement('p'); node.textContent = text; return node; }
function filterJobs() {
  const query = select('job-search').value.trim().toLocaleLowerCase('es');
  const cards = [...select('opportunities').querySelectorAll('article')];
  for (const card of cards) card.hidden = !card.textContent.toLocaleLowerCase('es').includes(query);
  select('search-empty').hidden = !cards.length || cards.some(card => !card.hidden);
}
select('job-search').addEventListener('input',filterJobs);
async function load() {
  const [opportunities, applications] = await Promise.all([request('/opportunities'), request('/applications')]);
  select('opportunities').replaceChildren();
  select('applications').replaceChildren();
  for (const item of opportunities) {
    const card = document.createElement('article');
    const title = document.createElement('h3');
    title.textContent = item.title;
    card.append(title, paragraph(item.company_name + ' · ' + item.location), paragraph(item.description));
    const button = document.createElement('button');
    button.textContent = 'Postularme';
    button.disabled = applications.some(row => row.opportunity_id === item.id);
    if (button.disabled) button.textContent = 'Postulación enviada';
    const note = document.createElement('textarea');
    note.maxLength = 3000;
    if (!button.disabled) {
      const details = document.createElement('details');
      const summary = document.createElement('summary');
      summary.textContent = 'Adjuntar una presentación';
      const label = document.createElement('label');
      label.textContent = 'Mensaje para la empresa (opcional)';
      label.append(note);
      details.append(summary,label);
      card.append(details);
    }
    button.onclick = () => perform(button, async () => {
      await request('/applications', { method: 'POST', body: JSON.stringify({ opportunity_id: item.id,cover_note:note.value.trim() }) });
      await load();
      message('Postulación registrada.');
    });
    card.append(button);
    select('opportunities').append(card);
  }
  if (!opportunities.length) select('opportunities').append(paragraph('Todavía no hay oportunidades publicadas. Podés preparar tu perfil y volver a consultar más adelante.'));
  filterJobs();
  for (const item of applications) {
    const title = opportunities.find(row => row.id === item.opportunity_id)?.title || 'Oportunidad archivada';
    select('applications').append(paragraph(title + ' · ' + ({submitted:'Enviada',reviewing:'En revisión',accepted:'Aceptada',rejected:'No seleccionada',withdrawn:'Retirada'}[item.status] || item.status)));
  }
  if (!applications.length) select('applications').append(paragraph('Todavía no realizaste postulaciones. Cuando encuentres una oportunidad de tu interés, podrás postularte y seguir su estado acá.'));
  message('Datos actualizados.');
}
select('reload').onclick = event => perform(event.target, async () => {
  await load();
  if (employerName) await loadEmployerInbox();
});
const reviewStates = {submitted:'Enviada',reviewing:'En revisión',accepted:'Aceptada',rejected:'No seleccionada',withdrawn:'Retirada'};
async function loadEmployerInbox() {
  const records = await request('/employer/applications');
  const inbox = select('employer-inbox');
  inbox.replaceChildren();
  if (!records.length) inbox.append(paragraph('Todavía no recibiste postulaciones.'));
  for (const row of records) {
    const entry = document.createElement('article');
    entry.append(paragraph(row.opportunities.title + ' · ' + reviewStates[row.status]));
    if (row.cover_note) entry.append(paragraph(row.cover_note));
    const actions = row.status === 'submitted' ? [['reviewing','Pasar a revisión']] :
      row.status === 'reviewing' ? [['accepted','Aceptar'],['rejected','Rechazar']] : [];
    for (const [status,label] of actions) {
      const button = document.createElement('button');
      button.textContent = label;
      button.onclick = () => perform(button,async () => {
        await request('/employer/applications/'+row.id,{method:'PATCH',body:JSON.stringify({status})});
        await loadEmployerInbox();
        message('Estado actualizado.');
      });
      entry.append(button);
    }
    inbox.append(entry);
  }
}
select('employer-offer').onsubmit = event => {
  event.preventDefault();
  const form = event.currentTarget;
  perform(form.querySelector('button'),async () => {
    await request('/employer/offers',{method:'POST',body:JSON.stringify(Object.fromEntries(new FormData(form)))});
    form.reset();
    await load();
    message('Oportunidad publicada.');
  });
};
select('logout').onclick = () => { clearSession(); message('Sesión cerrada en este navegador.'); };



select('toggle-password').addEventListener('click', () => {
  const input = select('access-password');
  const visible = input.type === 'password';
  input.type = visible ? 'text' : 'password';
  select('toggle-password').textContent = visible ? 'Ocultar' : 'Mostrar';
  select('toggle-password').setAttribute('aria-pressed', String(visible));
});
document.title = 'Acceso · Glovta';


async function loadSections(only) {
  const started = generation;
  const entries = await Promise.all((only ? [only] : Object.keys(profileSections)).map(async key => {
    try { return [key, await request('/profile-sections/' + key)]; }
    catch (error) { return [key, { error: error.message }]; }
  }));
  if (started !== generation || !session) return false;
  let complete = true;
  const root = select('professional-sections');
  if (!only) root.replaceChildren();
  for (const [key, rows] of entries) {
    const spec = profileSections[key];
    counts.set(key, Array.isArray(rows) ? rows.length : null);
    const section = document.createElement('section');
    section.className = 'panel';
    section.id = 'section-' + key;
    const heading = document.createElement('h2');
    heading.textContent = spec.title;
    section.append(heading);
    if (!Array.isArray(rows)) {
      complete = false;
      section.append(paragraph(rows.error || 'No se pudo cargar esta sección.'));
      const retry = document.createElement('button');
      retry.textContent = 'Reintentar';
      retry.onclick = () => perform(retry, async () => {
        const loaded = await loadSections(key);
        message(loaded ? 'Sección actualizada.' : 'No se pudo cargar la sección. Intentá nuevamente.');
      });
      section.append(retry);
      const previous = select(section.id);
      if (previous) previous.replaceWith(section); else root.append(section);
      renderPassportSection(key, null);
      continue;
    }
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    summary.textContent = 'Agregar ' + spec.title.toLowerCase();
    const form = document.createElement('form');
    let editing = null;
    for (const [name, [caption, type, required]] of Object.entries(spec.fields)) {
      const label = document.createElement('label');
      label.textContent = caption;
      const input = document.createElement(Array.isArray(type) ? 'select' : typeof type === 'number' && type > 500 ? 'textarea' : 'input');
      input.name = name;
      if (Array.isArray(type)) for (const value of type) {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = profileLabels[value] || value;
        input.append(option);
      }
      else if (type === 'boolean') input.type = 'checkbox';
      else if (type === 'date') input.type = 'date';
      else input.maxLength = type;
      input.required = Boolean(required);
      label.append(input); form.append(label);
    }
    const save = document.createElement('button');
    save.textContent = 'Guardar registro';
    const cancel = document.createElement('button');
    cancel.type = 'button'; cancel.textContent = 'Cancelar'; cancel.className = 'quiet';
    cancel.onclick = () => { editing = null; form.reset(); details.open = false; };
    form.append(save,cancel);
    form.onsubmit = event => {
      event.preventDefault();
      perform(save,async()=>{
        const payload = Object.fromEntries(new FormData(form));
        for (const [name,[,type]] of Object.entries(spec.fields)) if(type==='boolean') payload[name]=form.elements[name].checked;
        await request('/profile-sections/'+key+(editing?'/'+editing:''),{method:editing?'PUT':'POST',body:JSON.stringify(payload)});
        const loaded = await loadSections(key);
        if (loaded) select('section-' + key).querySelector('summary').focus();
        message(loaded ? 'Información profesional guardada.' : 'Registro guardado. Reintentá cargar la sección para verlo.');
      });
    };
    details.append(summary,form);
    for (const row of rows) {
      const card = document.createElement('article');
      for (const [name,[caption,type]] of Object.entries(spec.fields)) {
        if (row[name] == null || row[name] === '' || row[name] === false) continue;
        const value = type === 'date' ? formatMonth(row[name]) : type === 'boolean' ? 'Sí' : Array.isArray(type) ? profileLabels[row[name]] || row[name] : row[name];
        card.append(paragraph(caption + ': ' + value));
      }
      const edit = document.createElement('button');
      edit.textContent = 'Editar'; edit.className = 'quiet';
      edit.onclick=()=>{
        editing=row.id; details.open=true;
        for(const [name,[,type]] of Object.entries(spec.fields)) {
          if(type==='boolean') form.elements[name].checked=Boolean(row[name]);
          else form.elements[name].value=row[name]??'';
        }
        form.querySelector('input,select,textarea').focus();
      };
      const remove=document.createElement('button');
      remove.textContent='Eliminar'; remove.className='quiet';
      remove.onclick=()=>{
        if(!confirm('¿Eliminar este registro de '+spec.title.toLowerCase()+'?')) return;
        perform(remove,async()=>{
          await request('/profile-sections/'+key+'/'+row.id,{method:'DELETE'});
          const loaded = await loadSections(key);
          if (loaded) select('section-' + key).querySelector('summary').focus();
          message(loaded ? 'Registro eliminado.' : 'Registro eliminado. Reintentá cargar la sección.');
        });
      };
      card.append(edit,remove);section.append(card);
    }
    if(!rows.length) section.append(paragraph('Todavía no agregaste información en esta sección.'));
    section.append(details);
    const previous = select(section.id);
    if (previous) previous.replaceWith(section); else root.append(section);
    renderPassportSection(key, rows);

  }
  updatePreview();
  showView();
  return complete;
}

const sectionPrompts = {
  experiences: 'Podés sumar un proyecto académico, personal o de voluntariado.',
  education: 'Agregá un curso, una certificación o una carrera en curso.',
  languages: 'Indicá qué idiomas usás y en qué nivel.',
  skills: 'Elegí una habilidad que hayas aplicado en un proyecto.'
};

function renderPassportSection(key, rows) {
  const card = document.createElement('section');
  card.id = 'passport-' + key;
  card.classList.toggle('passport-empty', !rows?.length);
  const heading = document.createElement('h3');
  heading.textContent = profileSections[key].title;
  card.append(heading);
  const ordered = [...(rows || [])];
  if (key === 'experiences' || key === 'education') {
    ordered.sort((a,b) => Number(Boolean(b.is_current)) - Number(Boolean(a.is_current)) || (b.start_date || '').localeCompare(a.start_date || ''));
  }
  const groups = new Map();
  for (const row of ordered) {
    if (key === 'skills') {
      const category = profileLabels[row.category] || 'Otras habilidades';
      if (!groups.has(category)) {
        const group = document.createElement('div');
        group.className = 'skill-group';
        group.append(paragraph(category));
        groups.set(category, group);
        card.append(group);
      }
      const chip = document.createElement('span');
      chip.className = 'skill-chip';
      chip.textContent = row.name;
      groups.get(category).append(chip);
      continue;
    }
    const entry = document.createElement('div');
    entry.className = 'passport-entry';
    const title = document.createElement('strong');
    title.textContent = row.position || row.title || row.language || row.name;
    entry.append(title);
    const category = profileLabels[row.experience_type || row.education_type || row.proficiency || row.category];
    const context = [row.organization || row.institution, category].filter(Boolean).join(' · ');
    if (context) entry.append(paragraph(context));
    const dates = [formatMonth(row.start_date), row.is_current ? 'Actualidad' : formatMonth(row.end_date)].filter(Boolean).join(' — ');
    if (dates) entry.append(paragraph(dates));
    if (row.achievements || row.description) entry.append(paragraph(row.achievements || row.description));
    card.append(entry);
  }
  if (!rows?.length) card.append(paragraph(rows ? sectionPrompts[key] : 'No se pudo cargar esta sección.'));
  const link = document.createElement('a');
  link.href = '#section-' + key;
  link.textContent = rows?.length ? 'Editar' : rows ? 'Agregar' : 'Ir a reintentar';
  link.setAttribute('aria-label', link.textContent + ' · ' + heading.textContent);
  card.append(link);
  const previous = select(card.id);
  if (previous) previous.replaceWith(card); else select('passport-sections').append(card);
}

select('print-passport').addEventListener('click', () => window.print());

const dateFormat = new Intl.DateTimeFormat('es-AR',{month:'long',year:'numeric',timeZone:'UTC'});
function formatMonth(value) {
  return value ? dateFormat.format(new Date(value)) : '';
}
formProfile.addEventListener('invalid', event => {
  if (location.hash === '#preferences' && event.target.name === 'full_name') {
    location.hash = '#profile';
    message('Completá tu nombre en Presentación antes de guardar las preferencias.');
  }
},true);
