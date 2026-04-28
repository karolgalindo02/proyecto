const pool = require('../config/db');

async function createNotification({
  user_id,
  type = 'GENERAL',
  title,
  message = '',
  related_project_id = null,
  related_task_id = null,
  actor_id = null,
}) {
  if (!user_id || !title) return null;
  // No notificarse a sí mismo
  if (actor_id && Number(actor_id) === Number(user_id)) return null;
  try {
    const [r] = await pool.query(
      `INSERT INTO notifications
        (user_id, type, title, message, related_project_id, related_task_id, actor_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user_id, type, title, message, related_project_id, related_task_id, actor_id]
    );
    return r.insertId;
  } catch (e) {
    console.error('createNotification error:', e.message);
    return null;
  }
}

// Notificar a TODOS los miembros de un proyecto excepto al actor
async function notifyProjectMembers({ project_id, type, title, message, actor_id, related_task_id }) {
  try {
    const [members] = await pool.query(
      'SELECT user_id FROM project_members WHERE project_id = ?',
      [project_id]
    );
    await Promise.all(
      members
        .filter((m) => Number(m.user_id) !== Number(actor_id))
        .map((m) =>
          createNotification({
            user_id: m.user_id,
            type, title, message,
            related_project_id: project_id,
            related_task_id,
            actor_id,
          })
        )
    );
  } catch (e) {
    console.error('notifyProjectMembers error:', e.message);
  }
}

module.exports = { createNotification, notifyProjectMembers };