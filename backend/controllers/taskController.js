const pool = require('../config/db');
const { createNotification, notifyProjectMembers } = require('../services/NotificationService');

function deriveStatusFromProgress(progress, fallback) {
  if (progress >= 100) return 'DONE';
  if (progress > 0) return 'IN_PROGRESS';
  return fallback || 'PENDING';
}

// POST /api/tasks — project_id y assigned_to son OPCIONALES
exports.create = async (req, res) => {
  try {
    const {
      title,
      description = '',
      project_id = null,
      assigned_to = null,
      progress = 0,
      priority = 'MEDIUM',
      status,
      due_date = null,
      due_time = null,
    } = req.body;

    if (!title) return res.status(400).json({ success: false, message: 'El título es requerido' });

    // Si viene project_id validar pertenencia
    if (project_id) {
      const [pm] = await pool.query(
        'SELECT role FROM project_members WHERE user_id = ? AND project_id = ? LIMIT 1',
        [req.user.id, project_id]
      );
      if (!pm.length) return res.status(403).json({ success: false, message: 'No perteneces a este proyecto' });
    }

    const finalStatus = status || deriveStatusFromProgress(Number(progress) || 0);
    const [r] = await pool.query(
      `INSERT INTO tasks
         (title, description, project_id, created_by, assigned_to, progress, priority, status, due_date, due_time)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, project_id, req.user.id, assigned_to, Number(progress) || 0, priority, finalStatus, due_date, due_time]
    );
    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [r.insertId]);
    const createdTask = rows[0];

    // 🔔 Notificaciones
    // 1. Si se asignó a otro usuario → notificar al asignado
    if (createdTask.assigned_to && Number(createdTask.assigned_to) !== Number(req.user.id)) {
      await createNotification({
        user_id: createdTask.assigned_to,
        type: 'TASK_ASSIGNED',
        title: 'Te asignaron una tarea',
        message: `\"${createdTask.title}\"`,
        related_project_id: createdTask.project_id,
        related_task_id: createdTask.id,
        actor_id: req.user.id,
      });
    }
    // 2. Si pertenece a un proyecto → notificar a otros miembros
    if (createdTask.project_id) {
      await notifyProjectMembers({
        project_id: createdTask.project_id,
        type: 'TASK_CREATED',
        title: 'Nueva tarea en el proyecto',
        message: `\"${createdTask.title}\"`,
        related_task_id: createdTask.id,
        actor_id: req.user.id,
      });
    }

    return res.status(201).json({ success: true, data: { task: createdTask } });
  } catch (err) {
    console.error('create task', err);
    return res.status(500).json({ success: false, message: 'Error al crear tarea' });
  }
};

// GET /api/tasks?project_id=&status=&date=
// Devuelve las tareas visibles para el usuario:
//   - tareas creadas por él
//   - tareas asignadas a él
//   - tareas de proyectos donde es miembro
exports.list = async (req, res) => {
  try {
    const { project_id, status, date, scope } = req.query;
    const params = [];
    let where = ' WHERE 1=1 ';

    if (project_id) {
      const [pm] = await pool.query(
        'SELECT role FROM project_members WHERE user_id = ? AND project_id = ? LIMIT 1',
        [req.user.id, project_id]
      );
      if (!pm.length) return res.status(403).json({ success: false, message: 'Sin acceso al proyecto' });
      where += ' AND t.project_id = ? ';
      params.push(project_id);
    } else {
      where += ` AND (
          t.created_by = ? OR t.assigned_to = ?
          OR t.project_id IN (SELECT project_id FROM project_members WHERE user_id = ?)
        ) `;
      params.push(req.user.id, req.user.id, req.user.id);
    }
    if (status) { where += ' AND t.status = ? '; params.push(String(status).toUpperCase()); }
    if (date)   { where += ' AND t.due_date = ? '; params.push(date); }
    if (scope === 'today') { where += ' AND t.due_date = CURDATE() '; }

    const [rows] = await pool.query(
      `SELECT t.*, p.name AS project_name
         FROM tasks t
         LEFT JOIN projects p ON p.id = t.project_id
         ${where}
         ORDER BY t.created_at DESC
         LIMIT 500`,
      params
    );
    return res.json({ success: true, data: { tasks: rows } });
  } catch (err) {
    console.error('list tasks', err);
    return res.status(500).json({ success: false, message: 'Error al listar tareas' });
  }
};

// PUT /api/tasks/:id
exports.update = async (req, res) => {
  try {
    const taskId = req.params.id;
    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [taskId]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Tarea no encontrada' });
    const task = rows[0];

    // Permisos: creador, asignado, o admin del proyecto
    let allowed = task.created_by === req.user.id || task.assigned_to === req.user.id;
    if (!allowed && task.project_id) {
      const [pm] = await pool.query(
        'SELECT role FROM project_members WHERE user_id = ? AND project_id = ? LIMIT 1',
        [req.user.id, task.project_id]
      );
      if (pm.length && pm[0].role === 'ADMIN') allowed = true;
    }
    if (!allowed) return res.status(403).json({ success: false, message: 'Sin permiso' });

    const fields = ['title','description','progress','priority','status','due_date','due_time','assigned_to'];
    const updates = [];
    const values = [];
    for (const f of fields) {
      if (req.body[f] !== undefined) { updates.push(`${f} = ?`); values.push(req.body[f]); }
    }
    if (req.body.progress !== undefined && req.body.status === undefined) {
      updates.push('status = ?');
      values.push(deriveStatusFromProgress(Number(req.body.progress) || 0, task.status));
    }
    if (!updates.length) return res.json({ success: true, data: { task } });

    values.push(taskId);
    await pool.query(`UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`, values);
    const [updated] = await pool.query('SELECT * FROM tasks WHERE id = ?', [taskId]);
     // 🔔 Si el assigned_to cambió a un nuevo usuario → notificar
    const newAssignee = updated[0].assigned_to;
    if (newAssignee && Number(newAssignee) !== Number(task.assigned_to) && Number(newAssignee) !== Number(req.user.id)) {
      await createNotification({
        user_id: newAssignee,
        type: 'TASK_ASSIGNED',
        title: 'Te asignaron una tarea',
        message: `\"${updated[0].title}\"`,
        related_project_id: updated[0].project_id,
        related_task_id: updated[0].id,
        actor_id: req.user.id,
      });
    }
    return res.json({ success: true, data: { task: updated[0] } });
  } catch (err) {
    console.error('update task', err);
    return res.status(500).json({ success: false, message: 'Error al actualizar tarea' });
  }
};

// DELETE /api/tasks/:id
exports.remove = async (req, res) => {
  try {
    const taskId = req.params.id;
    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [taskId]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Tarea no encontrada' });
    const task = rows[0];

    let allowed = task.created_by === req.user.id;
    if (!allowed && task.project_id) {
      const [pm] = await pool.query(
        'SELECT role FROM project_members WHERE user_id = ? AND project_id = ? LIMIT 1',
        [req.user.id, task.project_id]
      );
      if (pm.length && pm[0].role === 'ADMIN') allowed = true;
    }
    if (!allowed) return res.status(403).json({ success: false, message: 'Sin permiso' });

    await pool.query('DELETE FROM tasks WHERE id = ?', [taskId]);
    return res.json({ success: true, message: 'Tarea eliminada' });
  } catch (err) {
    console.error('remove task', err);
    return res.status(500).json({ success: false, message: 'Error al eliminar tarea' });
  }
};

// GET /api/dashboard/summary
exports.dashboardSummary = async (req, res) => {
  try {
    const [[counts]] = await pool.query(
      `SELECT
         COUNT(*) AS total,
         SUM(CASE WHEN status='DONE' THEN 1 ELSE 0 END) AS done,
         SUM(CASE WHEN status='IN_PROGRESS' THEN 1 ELSE 0 END) AS in_progress
       FROM tasks t
       WHERE t.created_by = ? OR t.assigned_to = ?
          OR t.project_id IN (SELECT project_id FROM project_members WHERE user_id = ?)`,
      [req.user.id, req.user.id, req.user.id]
    );
    const [[projCount]] = await pool.query(
      'SELECT COUNT(*) AS c FROM project_members WHERE user_id = ?',
      [req.user.id]
    );
    const total = Number(counts.total) || 0;
    const done = Number(counts.done) || 0;
    const in_progress = Number(counts.in_progress) || 0;
    const completion_percent = total ? Math.round((done / total) * 100) : 0;
    return res.json({
      success: true,
      data: { total, done, in_progress, completion_percent, project_count: Number(projCount.c) || 0 },
    });
  } catch (err) {
    console.error('summary', err);
    return res.status(500).json({ success: false, message: 'Error resumen' });
  }
};