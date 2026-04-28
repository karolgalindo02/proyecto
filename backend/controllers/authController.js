const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

function sign(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
}

function publicUser(u) {
  if (!u) return null;
  const { password, ...rest } = u;
  return rest;
}

exports.register = async (req, res) => {
  try {
    const { name, lastname = '', email, phone = null, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Faltan campos requeridos' });
    }
    const [exists] = await pool.query('SELECT id FROM users WHERE email = ? LIMIT 1', [email.toLowerCase()]);
    if (exists.length) return res.status(400).json({ success: false, message: 'El email ya está registrado' });

    const hash = await bcrypt.hash(password, 10);
    const [r] = await pool.query(
      'INSERT INTO users (email, name, lastname, phone, password) VALUES (?, ?, ?, ?, ?)',
      [email.toLowerCase(), name, lastname, phone, hash]
    );
    const [rows] = await pool.query('SELECT id, email, name, lastname, phone, image, created_at FROM users WHERE id = ?', [r.insertId]);
    const user = rows[0];
    return res.status(201).json({ success: true, data: { token: sign(user), user } });
  } catch (err) {
    console.error('register', err);
    return res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email y contraseña requeridos' });

    const [rows] = await pool.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email.toLowerCase()]);
    if (!rows.length) return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });

    return res.json({ success: true, data: { token: sign(user), user: publicUser(user) } });
  } catch (err) {
    console.error('login', err);
    return res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};

exports.me = async (req, res) => {
  return res.json({ success: true, data: { user: req.user } });
};