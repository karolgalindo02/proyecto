// src/middleware/auth.js — Middleware que protege rutas con JWT
const passport = require('../config/passport');
module.exports = passport.authenticate('jwt', { session: false });