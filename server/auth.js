export function installAuthRoutes(app) {
  app.post('/api/auth/register', async (req, res) => {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim() : '';
    const password = req.body?.password;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 ||
        typeof password !== 'string' || password.length < 12 || password.length > 128) {
      return res.status(400).json({ error: 'Ingresá un correo válido y una contraseña de 12 a 128 caracteres.' });
    }
    const { error } = await req.db.auth.signUp({ email, password });
    if (error?.status === 429) return res.status(429).json({ error: 'Esperá unos minutos antes de volver a solicitar el registro.' });
    if (error && !['user_already_exists', 'email_exists'].includes(error.code)) {
      return res.status(400).json({ error: 'No se pudo registrar la cuenta. Revisá los datos o intentá más tarde.' });
    }
    return res.status(202).json({ message: 'Revisá tu correo por si necesitás confirmar el alta. Si ya confirmaste tu cuenta, podés ingresar.' });
  });
  app.post('/api/auth/password', async (req, res) => {
    const { access_token, refresh_token, password } = req.body || {};
    if (typeof access_token !== 'string' || !access_token || access_token.length > 8192 ||
        typeof refresh_token !== 'string' || !refresh_token || refresh_token.length > 4096 ||
        typeof password !== 'string' || password.length < 12 || password.length > 128) {
      return res.status(400).json({ error: 'Usá un enlace válido y una contraseña de 12 a 128 caracteres.' });
    }
    const session = await req.db.auth.setSession({ access_token, refresh_token });
    if (session.error || !session.data?.user) {
      return res.status(401).json({ error: 'El enlace venció o no es válido. Solicitá otro correo de recuperación.' });
    }
    const { error } = await req.db.auth.updateUser({ password });
    if (error) return res.status(400).json({ error: 'No se pudo guardar. Elegí una contraseña diferente que cumpla las reglas del servicio.' });
    res.json({ updated: true });
  });
  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body || {};
    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        email.length > 254 || typeof password !== 'string' || !password || password.length > 1024) {
      return res.status(400).json({ error: 'Revisá el correo y la contraseña.' });
    }
    const { data, error } = await req.db.auth.signInWithPassword({ email: email.trim(), password });
    if (error || !data?.session) {
      if (error?.code === 'invalid_credentials') {
        return res.status(401).json({ error: 'El correo o la contraseña no coinciden.' });
      }
      if (error?.code === 'email_not_confirmed') {
        return res.status(401).json({ error: 'La cuenta necesita confirmar su correo antes de ingresar.' });
      }
      if (error?.status === 429) {
        return res.status(429).json({ error: 'Hubo demasiados intentos. Esperá unos minutos antes de volver a ingresar.' });
      }
      return res.status(503).json({ error: 'El servicio de acceso no está disponible. Intentá nuevamente más tarde.' });
    }
    res.json({ access_token: data.session.access_token, refresh_token: data.session.refresh_token, expires_in: data.session.expires_in });
  });
  app.post('/api/auth/refresh', async (req, res) => {
    const token = req.body?.refresh_token;
    if (typeof token !== 'string' || !token || token.length > 4096) return res.status(400).json({ error: 'Sesión inválida.' });
    const { data, error } = await req.db.auth.refreshSession({ refresh_token: token });
    if (error || !data?.session) return res.status(401).json({ error: 'Volvé a iniciar sesión.' });
    res.json({ access_token: data.session.access_token, refresh_token: data.session.refresh_token, expires_in: data.session.expires_in });
  });
}


