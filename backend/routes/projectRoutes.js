const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.post('/', verifyToken, authorizeRoles(['admin']), projectController.createProject);
router.put('/:id', verifyToken, authorizeRoles(['admin']), projectController.updateProject);
router.delete('/:id', verifyToken, authorizeRoles(['admin']), projectController.deleteProject);
router.get('/', verifyToken, authorizeRoles(['admin', 'user']), projectController.getAllProjects); // ambos pueden consultar


module.exports = router;