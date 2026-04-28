const pool = require('../config/db');

// GET /api/notifications?only_unread=&limit=
exports.list = async (req, res) => {
  try {
    const { only_unread, limit = 50 } = req.query;
    const params = [req.user.id];
    let where = ' WHERE n.user_id = ? ';
    if (String(only_unread) === 'true') where += ' AND n.is_read = 0 ';
    const [rows] = await pool.query(
      `SELECT n.*,
              u.name AS actor_name, u.lastname AS actor_lastname, u.image AS actor_image,
              p.name AS project_name,
              t.title AS task_title
         FROM notifications n
         LEFT JOIN users u    ON u.id = n.actor_id
         LEFT JOIN projects p ON p.id = n.related_project_id
         LEFT JOIN tasks t    ON t.id = n.related_task_id
       ${where}
        ORDER BY n.created_at DESC
        LIMIT ?`,
      [...params, Number(limit)]
    );
    const [[{ unread }]] = await pool.query(
      'SELECT COUNT(*) AS unread FROM notifications WHERE user_id = ? AND is_read = 0',
      [req.user.id]
    );
    return res.json({ success: true, data: { notifications: rows, unread_count: Number(unread) || 0 } });
  } catch (err) {
    console.error('list notifications', err);
    return res.status(500).json({ success: false, message: 'Error notificaciones' });
  }
};

// GET /api/notifications/unread-count
exports.unreadCount = async (req, res) => {
  try {
    const [[{ unread }]] = await pool.query(
      'SELECT COUNT(*) AS unread FROM notifications WHERE user_id = ? AND is_read = 0',
      [req.user.id]
    );
    return res.json({ success: true, data: { unread_count: Number(unread) || 0 } });
  } catch (err) {
    console.error('unreadCount', err);
    return res.status(500).json({ success: false, message: 'Error' });
  }
};

// PATCH /api/notifications/:id/read
exports.markRead = async (req, res) => {
  try {
    await pool.query(
      'UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    return res.json({ success: true });
  } catch (err) {
    console.error('markRead', err);
    return res.status(500).json({ success: false, message: 'Error' });
  }
};

// POST /api/notifications/read-all
exports.markAllRead = async (req, res) => {
  try {
    await pool.query('UPDATE notifications SET is_read = 1 WHERE user_id = ?', [req.user.id]);
    return res.json({ success: true });
  } catch (err) {
    console.error('markAllRead', err);
    return res.status(500).json({ success: false, message: 'Error' });
  }
};

// DELETE /api/notifications/:id
exports.remove = async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM notifications WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    return res.json({ success: true });
  } catch (err) {
    console.error('remove notification', err);
    return res.status(500).json({ success: false, message: 'Error' });
  }
};