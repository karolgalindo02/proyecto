const db = require('../config/config');
const Project = {};

Project.findAll = (result) => {
  const sql = `SELECT * FROM projects`;
  db.query(sql, (err, projects) => {
    if (err) {
      result(err, null);
    } else {
      result(null, projects);
    }
  });
};

Project.create = (project, result) => {
  const sql = `INSERT INTO projects (name, team, progress, status, created_at, updated_at)
               VALUES (?, ?, ?, ?, NOW(), NOW())`;
  db.query(sql, [
    project.name,
    project.team,
    project.progress || 0,
    project.status || 'In Progress'
  ], (err, res) => {
    if (err) {
      result(err, null);
    } else {
      result(null, { id: res.insertId, ...project });
    }
  });
};

Project.update = (id, project, result) => {
  const sql = `UPDATE projects SET name = ?, team = ?, progress = ?, status = ?, updated_at = NOW() WHERE id = ?`;
  db.query(sql, [
    project.name,
    project.team,
    project.progress,
    project.status,
    id
  ], (err, res) => {
    if (err) {
      result(err, null);
    } else {
      result(null, { id, ...project });
    }
  });
};

Project.delete = (id, result) => {
  const sql = `DELETE FROM projects WHERE id = ?`;
  db.query(sql, [id], (err, res) => {
    if (err) {
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

module.exports = Project;