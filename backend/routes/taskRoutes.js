const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Listar todas las tareas
router.get('/', taskController.getAllTasks);

// Crear una nueva tarea (solo admin)
router.post('/', taskController.createTask);

// Editar una tarea (usuario puede editar progreso, admin puede editar todo)
router.put('/:id', taskController.updateTask);

// Eliminar una tarea (solo admin)
router.delete('/:id', taskController.deleteTask);

module.exports = router;