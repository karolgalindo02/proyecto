const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.post('/', verifyToken, authorizeRoles(['admin']), taskController.createTask);
router.put('/:id', verifyToken, authorizeRoles(['admin', 'user']), taskController.updateTask);
router.get('/', verifyToken, authorizeRoles(['admin', 'user']), taskController.getAllTasks);
router.delete('/:id', verifyToken, authorizeRoles(['admin']), taskController.deleteTask);


module.exports = router;