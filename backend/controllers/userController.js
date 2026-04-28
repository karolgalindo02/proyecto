const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

// POST /api/users/me/image  (multipart/form-data, field name: \"image\")
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No se envió imagen' });

    // ruta pública servida por express.static
    const publicPath = `/uploads/avatars/${req.file.filename}`;

    // borrar la imagen anterior si existe (best effort)
    const [rows] = await pool.query('SELECT image FROM users WHERE id = ?', [req.user.id]);
    const oldImage = rows[0]?.image;
    if (oldImage && oldImage.startsWith('/uploads/avatars/')) {
      const oldFsPath = path.join(__dirname, '..', '..', oldImage);
      fs.unlink(oldFsPath, () => { /* ignora errores */ });
    }

    await pool.query('UPDATE users SET image = ? WHERE id = ?', [publicPath, req.user.id]);
    const [updated] = await pool.query(
      'SELECT id, email, name, lastname, phone, image, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    return res.json({ success: true, data: { user: updated[0], image: publicPath } });
  } catch (err) {
    console.error('uploadImage', err);
    return res.status(500).json({ success: false, message: err.message || 'Error subiendo imagen' });
  }
};

// DELETE /api/users/me/image
exports.removeImage = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT image FROM users WHERE id = ?', [req.user.id]);
    const oldImage = rows[0]?.image;
    if (oldImage && oldImage.startsWith('/uploads/avatars/')) {
      const oldFsPath = path.join(__dirname, '..', '..', oldImage);
      fs.unlink(oldFsPath, () => {});
    }
    await pool.query('UPDATE users SET image = NULL WHERE id = ?', [req.user.id]);
    return res.json({ success: true });
  } catch (err) {
    console.error('removeImage', err);
    return res.status(500).json({ success: false, message: 'Error' });
  }
};

// PUT /api/users/me — actualizar nombre / apellido / teléfono
exports.updateProfile = async (req, res) => {
  try {
    const { name, lastname, phone } = req.body;
    const updates = [];
    const values = [];
    if (name !== undefined)     { updates.push('name = ?');     values.push(String(name).slice(0, 90)); }
    if (lastname !== undefined) { updates.push('lastname = ?'); values.push(String(lastname).slice(0, 90)); }
    if (phone !== undefined)    { updates.push('phone = ?');    values.push(phone ? String(phone).slice(0, 20) : null); }
    if (!updates.length) return res.json({ success: true, data: { user: req.user } });

    values.push(req.user.id);
    await pool.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);
    const [rows] = await pool.query(
      'SELECT id, email, name, lastname, phone, image, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    return res.json({ success: true, data: { user: rows[0] } });
  } catch (err) {
    console.error('updateProfile', err);
    return res.status(500).json({ success: false, message: 'Error' });
  }
};