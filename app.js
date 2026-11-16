const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

// Keep sequential keyboard navigation inside the active modal.
document.addEventListener('keydown', event => {
  if (event.key !== 'Tab') return;
  const dialog = document.querySelector('dialog[open]');
  if (!dialog) return;
  const controls = $$('button, input, select, textarea, a[href], [tabindex="0"]', dialog)
    .filter(el => !el.disabled && el.getClientRects().length);
  const first = controls[0], last = controls.at(-1);
  if (!first) return;
  if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
    event.preventDefault(); last.focus();
  } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
    event.preventDefault(); first.focus();
  }
});

function readJSON(key, fallback) {
  const value = GlovtaStorage.read(key, fallback);
  return Array.isArray(fallback) ? (Array.isArray(value) ? value : fallback) : value;
}

function saveLocal(key, value, statusElement) {
  const saved = GlovtaStorage.write(key, value);
  if (!saved) {
    const message = 'No se pudo guardar en este navegador. Revisá el permiso o espacio de almacenamiento e intentá de nuevo. Tus datos siguen en el formulario.';
    if (statusElement) statusElement.textContent = message;
    else alert('No se pudo guardar en este navegador. Revisá el permiso o espacio de almacenamiento e intentá de nuevo.');
  }
  return saved;
}

const jobs = [
  { title: "Business Analyst", company: "Empresa demo", location: "Remoto · LATAM", match: 84, tags: ["Análisis", "SQL", "Inglés"] },
  { title: "Data Analyst Jr.", company: "Compañía demo", location: "Híbrido", match: 81, tags: ["Excel", "SQL", "Power BI"] },
  { title: "QA / UAT Analyst", company: "Proyecto demo", location: "Remoto", match: 76, tags: ["Testing", "UAT", "Documentación"] },
  { title: "Customer Success SaaS", company: "Empresa demo", location: "Remoto", match: 72, tags: ["SaaS", "Comunicación", "Inglés"] },
  { title: "Implementation Specialist", company: "Compañía demo", location: "Remoto", match: 69, tags: ["Onboarding", "Procesos", "SQL"] }
];

const products = [
  { id: "sql", title: "SQL práctico para empezar en tecnología", price: 24900, art: "SQL", desc: "Consultas, filtros, joins y casos de uso aplicados al trabajo." },
  { id: "excel", title: "Excel para el trabajo", price: 21900, art: "XL", desc: "Herramientas prácticas para análisis, reportes y operación." },
  { id: "remote", title: "Guía para conseguir tu primer trabajo remoto", price: 9900, art: "PDF", desc: "Ebook GLOVTA con estrategia, perfil y búsqueda organizada." },
  { id: "cv", title: "Tu CV preparado para la era de la IA", price: 0, art: "CV", desc: "Recurso gratuito para mejorar claridad y palabras clave." }
];

const money = value => value === 0 ? "Gratis" : new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(value);

function renderJobs(list = jobs) {
  const grid = $("#opportunityGrid");
  if (!list.length) {
    grid.innerHTML = '<div class="empty-state"><h3>No encontramos ese término</h3><p>Probá con una habilidad, como SQL, o una modalidad, como remoto.</p><button class="btn btn-outline-dark" type="button" data-reset-search>Ver todos los ejemplos</button></div>';
    return;
  }
  grid.innerHTML = list.map(job => `
    <article class="job-card">
      <div class="job-card-top">
        <div><h3>${escapeHtml(job.title)}</h3><small>${escapeHtml(job.company)} · ${escapeHtml(job.location)}</small></div>
        <span class="match">${job.match}% match</span>
      </div>
      <p>Ejemplo demostrativo para visualizar cómo GLOVTA presenta oportunidades y explica coincidencias.</p>
      <div class="job-meta">${job.tags.map(tag => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
    </article>
  `).join("");
}

function renderCourses() {
  const grid = $("#courseGrid");
  grid.innerHTML = products.map(p => `
    <article class="course-card">
      <div class="course-art" aria-hidden="true">${p.art}</div>
      <div>
        <p class="mini-label">PRODUCTO GLOVTA</p>
        <h3>${escapeHtml(p.title)}</h3>
        <p>${escapeHtml(p.desc)}</p>
        <div class="price">
          <strong>${money(p.price)}</strong>
          <button type="button" class="btn ${p.price === 0 ? "btn-outline-dark" : "btn-primary"}" data-add="${p.id}">${p.price === 0 ? "Agregar recurso" : "Agregar al carrito"}</button>
        </div>
      </div>
    </article>
  `).join("");
}

function escapeHtml(value = "") {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

function loadCart() {
  return [...new Set(readJSON("glovta-cart", []).filter(id => products.some(product => product.id === id)))];
}
function saveCart(cart) {
  saveLocal("glovta-cart", cart);
  renderCart();
}
function renderCart() {
  const cart = loadCart();
  $("#checkoutDemo").disabled = !cart.length;
  $("#cartStatus").textContent = '';
  $("#cartCount").textContent = cart.length;
  const items = $("#cartItems");
  if (!cart.length) {
    items.innerHTML = `<p class="legal-note">Todavía no agregaste productos.</p>`;
  } else {
    items.innerHTML = cart.map(id => {
      const p = products.find(x => x.id === id);
      if (!p) return "";
      return `<div class="cart-item"><div><strong>${escapeHtml(p.title)}</strong><small>${money(p.price)}</small></div><button class="tool-btn" type="button" data-remove="${p.id}" aria-label="Quitar ${escapeHtml(p.title)}">×</button></div>`;
    }).join("");
  }
  const total = cart.reduce((acc,id) => acc + (products.find(x => x.id === id)?.price || 0), 0);
  $("#cartTotal").textContent = money(total);
}

document.addEventListener("click", event => {
  if (event.target.closest('[data-reset-search]')) {
    $('#jobQuery').value = '';
    $('#jobSearchForm').requestSubmit();
    $('#jobQuery').focus();
  }
  const add = event.target.closest("[data-add]");
  if (add) {
    const cart = loadCart();
    if (!cart.includes(add.dataset.add)) cart.push(add.dataset.add);
    saveCart(cart);
    openCart();
  }
  const remove = event.target.closest("[data-remove]");
  if (remove) saveCart(loadCart().filter(id => id !== remove.dataset.remove));
  const opener = event.target.closest("[data-open]");
  if (opener) document.getElementById(opener.dataset.open)?.showModal();
});

function openCart() {
  $("#cart").classList.add("open");
  $("#cart").showModal();
}
$("#openCart").addEventListener("click", openCart);
$("#closeCart").addEventListener("click", () => $("#cart").close());
$("#cart").addEventListener("close", () => $("#cart").classList.remove("open"));
$("#checkoutDemo").addEventListener("click", () => {
  $('#cartStatus').textContent = 'Selección guardada en este navegador. Esta demostración no procesa pagos ni entrega archivos.';
});

$("#jobSearchForm").addEventListener("submit", event => {
  event.preventDefault();
  const query = $("#jobQuery").value.trim().toLowerCase();
  const filtered = query ? jobs.filter(job => [job.title, job.company, job.location, ...job.tags].join(" ").toLowerCase().includes(query)) : jobs;
  renderJobs(filtered);
  $("#searchStatus").textContent = filtered.length ? `${filtered.length} ejemplos de oportunidades. No son vacantes activas.` : "No hubo coincidencias. Probá con otro término.";
});

$("#contactForm").addEventListener("submit", event => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget));
  const leads = GlovtaStorage.records("glovta-leads", ['name', 'email', 'service']);
  leads.push({ ...data, createdAt: new Date().toISOString(), status: "nuevo" });
  if (!saveLocal("glovta-leads", leads, $("#contactStatus"))) return;
  $("#contactStatus").textContent = "Consulta guardada en este navegador (modo demo).";
  event.currentTarget.reset();
});

$("#premiumDemo").addEventListener("click", () => $("#premiumDialog").showModal());

let fontScale = Number(readJSON("glovta-font-scale", 1));
fontScale = Number.isFinite(fontScale) ? Math.min(1.25, Math.max(.9, fontScale)) : 1;
function applyFontScale() {
  document.documentElement.style.setProperty("--font-scale", fontScale.toFixed(2));
  GlovtaStorage.write("glovta-font-scale", fontScale);
}
$("#fontDown").addEventListener("click", () => { fontScale = Math.max(.9, fontScale - .05); applyFontScale(); });
$("#fontReset").addEventListener("click", () => { fontScale = 1; applyFontScale(); });
$("#fontUp").addEventListener("click", () => { fontScale = Math.min(1.25, fontScale + .05); applyFontScale(); });
applyFontScale();

const contrastToggle = $("#contrastToggle");
if (Number(readJSON("glovta-high-contrast", 0)) === 1) document.body.classList.add("high-contrast");
contrastToggle.setAttribute("aria-pressed", document.body.classList.contains("high-contrast"));
contrastToggle.addEventListener("click", () => {
  const on = document.body.classList.toggle("high-contrast");
  contrastToggle.setAttribute("aria-pressed", String(on));
  GlovtaStorage.write("glovta-high-contrast", on ? 1 : 0);
});

const mobileMenu = $("#mobileMenu");
mobileMenu.addEventListener("click", () => {
  const open = $("#mainNav").classList.toggle("open");
  mobileMenu.setAttribute("aria-expanded", String(open));
});

const passportDialog = $("#passportDialog");
const savedPassport = GlovtaStorage.passport();
if (savedPassport) {
  for (const field of $$('#passportForm input[name], #passportForm textarea[name]')) {
    if (typeof savedPassport[field.name] === 'string') field.value = savedPassport[field.name];
  }
}
$("#closePassport").addEventListener("click", () => passportDialog.close());
let step = 1;
function updateStep() {
  $('#stepStatus').textContent = `Paso ${step} de 3 · ${['Objetivo', 'Habilidades', 'Experiencia'][step - 1]}`;
  $$(".passport-step", passportDialog).forEach(el => el.hidden = Number(el.dataset.step) !== step);
  $$(".step-indicator span", passportDialog).forEach((el, index) => el.classList.toggle("on", index + 1 <= step));
  $("#prevStep").hidden = step === 1;
  $("#nextStep").hidden = step === 3;
  $("#savePassport").hidden = step !== 3;
}
$("#nextStep").addEventListener("click", () => {
  const fields = $$(".passport-step:not([hidden]) input, .passport-step:not([hidden]) textarea", passportDialog);
  if (fields.some(field => !field.reportValidity())) return;
  step = Math.min(3, step + 1); updateStep();
  $('.passport-step:not([hidden]) input, .passport-step:not([hidden]) textarea', passportDialog)?.focus();
});
$("#prevStep").addEventListener("click", () => { step = Math.max(1, step - 1); updateStep(); });
$("#passportForm").addEventListener("submit", event => {
  event.preventDefault();
  if (step < 3) { $('#nextStep').click(); return; }
  const data = Object.fromEntries(new FormData(event.currentTarget));
  if (!saveLocal("glovta-passport", data, $("#passportStatus"))) return;
  $("#passportStatus").textContent = "Perfil guardado en este navegador. Podés cerrar esta ventana y volver a editarlo cuando quieras.";
});
passportDialog.addEventListener("close", () => { step = 1; updateStep(); $("#passportStatus").textContent = ''; });
updateStep();

renderJobs();
renderCourses();
renderCart();


// Agenda GLOVTA (demo local)
let calendarCursor = new Date();
calendarCursor.setDate(1);

function getAppointments() {
  return GlovtaStorage.records("glovta-appointments", ['date', 'time', 'name', 'email']);
}

function saveAppointments(items) {
  return saveLocal("glovta-appointments", items, $("#appointmentStatus"));
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function toISODate(year, month, day) {
  return `${year}-${pad2(month + 1)}-${pad2(day)}`;
}

function renderCalendar() {
  const title = $("#calendarTitle");
  const grid = $("#calendarGrid");
  if (!title || !grid) return;

  const year = calendarCursor.getFullYear();
  const month = calendarCursor.getMonth();
  const monthName = new Intl.DateTimeFormat("es-AR", { month: "long", year: "numeric" }).format(calendarCursor);
  title.textContent = monthName.charAt(0).toUpperCase() + monthName.slice(1);

  const first = new Date(year, month, 1);
  const startOffset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysPrevMonth = new Date(year, month, 0).getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const appointments = getAppointments();
  const selected = $("#appointmentDate")?.value || "";
  const cells = [];

  for (let i = 0; i < 42; i++) {
    let day, cellMonth = month, cellYear = year, other = false;

    if (i < startOffset) {
      day = daysPrevMonth - startOffset + i + 1;
      cellMonth = month - 1;
      other = true;
    } else if (i >= startOffset + daysInMonth) {
      day = i - (startOffset + daysInMonth) + 1;
      cellMonth = month + 1;
      other = true;
    } else {
      day = i - startOffset + 1;
    }

    if (cellMonth < 0) { cellMonth = 11; cellYear--; }
    if (cellMonth > 11) { cellMonth = 0; cellYear++; }

    const date = new Date(cellYear, cellMonth, day);
    date.setHours(0, 0, 0, 0);
    const iso = toISODate(cellYear, cellMonth, day);
    const past = date < today;
    const hasBooking = appointments.some(a => a.date === iso);

    cells.push(
      `<button type="button" class="calendar-day${other ? " is-other" : ""}${past ? " is-past" : ""}${selected === iso ? " is-selected" : ""}${hasBooking ? " has-booking" : ""}" data-date="${iso}" ${past ? "disabled" : ""} aria-label="${iso}">${day}</button>`
    );
  }

  grid.innerHTML = cells.join("");
}

$("#prevMonth")?.addEventListener("click", () => {
  calendarCursor = new Date(calendarCursor.getFullYear(), calendarCursor.getMonth() - 1, 1);
  renderCalendar();
});

$("#nextMonth")?.addEventListener("click", () => {
  calendarCursor = new Date(calendarCursor.getFullYear(), calendarCursor.getMonth() + 1, 1);
  renderCalendar();
});

$("#calendarGrid")?.addEventListener("click", event => {
  const day = event.target.closest("[data-date]");
  if (!day || day.disabled) return;
  $("#appointmentDate").value = day.dataset.date;
  renderCalendar();
});

$("#appointmentForm")?.addEventListener("submit", event => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget));

  if (!data.date || !data.time) {
    $("#appointmentStatus").textContent = "Elegí fecha y horario.";
    return;
  }

  const appointmentDate = new Date(`${data.date}T${data.time}:00`);
  const allowedTimes = [...$('#appointmentTime').options].map(option => option.value).filter(Boolean);
  const validDay = /^\d{4}-\d{2}-\d{2}$/.test(data.date) && Number.isFinite(appointmentDate.getTime()) && toISODate(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate()) === data.date;
  if (!validDay || !allowedTimes.includes(data.time) || appointmentDate <= new Date()) {
    $("#appointmentStatus").textContent = 'Elegí una fecha y un horario válidos en el futuro.';
    return;
  }

  const appointments = getAppointments();
  const exists = appointments.some(a => a.date === data.date && a.time === data.time);
  if (exists) {
    $("#appointmentStatus").textContent = "Ese horario ya figura reservado en este navegador.";
    return;
  }

  appointments.push({
    ...data,
    status: "reservada",
    meetingUrl: null,
    calendarEventId: null,
    createdAt: new Date().toISOString()
  });

  if (!saveAppointments(appointments)) return;
  $("#appointmentStatus").textContent = data.mode === "Google Meet"
    ? "Reserva guardada. En producción, Google Calendar generará el enlace de Meet."
    : "Reserva guardada en modo demo.";

  event.currentTarget.reset();
  renderCalendar();
});

renderCalendar();

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}

// Open the selected journey without forcing a long landing page.
function revealSection(hash) {
  if (!hash || !hash.startsWith('#')) return;
  const target = document.getElementById(hash.slice(1));
  const details = target?.querySelector('details.section-disclosure');
  if (details) details.open = true;
}
document.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]');
  if (link) { revealSection(link.getAttribute('href')); document.querySelector('#mainNav').classList.remove('open'); document.querySelector('#mobileMenu').setAttribute('aria-expanded','false'); }
  const service = event.target.closest('[data-service]');
  if (service) document.querySelector('#contactForm select').value = service.dataset.service;
});
window.addEventListener('hashchange', () => revealSection(location.hash));
revealSection(location.hash);
