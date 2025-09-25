const db = require('../config/config');
const Task = {};

Task.findAll = (result) => {
  const sql = `SELECT * FROM tasks`;
  db.query(sql, (err, tasks) => {
    if (err) {
      result(err, null);
    } else {
      result(null, tasks);
    }
  });
};

Task.create = (task, result) => {
  const sql = `INSERT INTO tasks (name, description, project_id, assigned_to, progress, priority, due_date, status, created_at, updated_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
  db.query(sql, [
    task.name,
    task.description,
    task.project_id,
    task.assigned_to,
    task.progress || 0,
    task.priority || 'media',
    task.due_date,
    task.status || 'en progreso'
  ], (err, res) => {
    if (err) {
      result(err, null);
    } else {
      result(null, { id: res.insertId, ...task });
    }
  });
};

Task.update = (id, task, result) => {
  const sql = `UPDATE tasks SET name = ?, description = ?, project_id = ?, assigned_to = ?, progress = ?, priority = ?, due_date = ?, status = ?, updated_at = NOW() WHERE id = ?`;
  db.query(sql, [
    task.name,
    task.description,
    task.project_id,
    task.assigned_to,
    task.progress,
    task.priority,
    task.due_date,
    task.status,
    id
  ], (err, res) => {
    if (err) {
      result(err, null);
    } else {
      result(null, { id, ...task });
    }
  });
};

Task.delete = (id, result) => {
  const sql = `DELETE FROM tasks WHERE id = ?`;
  db.query(sql, [id], (err, res) => {
    if (err) {
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

module.exports = Task;