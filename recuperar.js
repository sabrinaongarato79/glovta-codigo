const params = new URLSearchParams(location.hash.slice(1));
let access = params.get('access_token');
let refresh = params.get('refresh_token');
const recovery = params.get('type') === 'recovery';
history.replaceState(null, '', location.pathname);
const form = document.getElementById('recovery');
const status = document.getElementById('status');
if (params.get('type') === 'signup' && access && refresh) {
  access = refresh = null;
  location.replace('/portal.html');
} else if (recovery && access && refresh) {
  form.hidden = false;
} else {
  status.textContent = 'Abrí esta página desde el enlace del correo de recuperación más reciente.';
}
form.addEventListener('submit', async event => {
  event.preventDefault();
  const password = form.elements.password.value;
  if (password !== form.elements.confirmation.value) {
    status.textContent = 'Las contraseñas no coinciden.';
    return;
  }
  const button = form.querySelector('button');
  button.disabled = true;
  status.textContent = 'Guardando…';
  try {
    const response = await fetch('/api/auth/password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ access_token: access, refresh_token: refresh, password }),
      signal: AbortSignal.timeout(20000)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'No se pudo actualizar la contraseña.');
    access = refresh = null;
    form.hidden = true;
    status.textContent = 'Contraseña actualizada. Ya podés ir al inicio de sesión e ingresar con ella.';
  } catch (error) {
    status.textContent = error.name === 'TimeoutError' ? 'La conexión tardó demasiado. Probá ingresar con la contraseña nueva antes de volver a intentar.' : error.message;
  } finally {
    form.reset();
    button.disabled = false;
  }
});
