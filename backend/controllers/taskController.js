const Task = require('../models/task');

module.exports = {
  getAllTasks(req, res) {
    Task.findAll((err, tasks) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error al listar tareas', error: err });
      }
      return res.status(200).json({ success: true, data: tasks });
    });
  },
  createTask(req, res) {
    const task = req.body;
    Task.create(task, (err, data) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error al crear tarea', error: err });
      }
      return res.status(201).json({ success: true, message: 'Tarea creada', data });
    });
  },
  updateTask(req, res) {
    const id = req.params.id;
    const task = req.body;
    Task.update(id, task, (err, data) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error al actualizar tarea', error: err });
      }
      return res.status(200).json({ success: true, message: 'Tarea actualizada', data });
    });
  },
  deleteTask(req, res) {
    const id = req.params.id;
    Task.delete(id, (err, data) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error al eliminar tarea', error: err });
      }
      return res.status(200).json({ success: true, message: 'Tarea eliminada', data });
    });
  }
};