const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.post('/login', userController.login);
router.post('/create', userController.register);

// Rutas protegidas
router.get('/', verifyToken, authorizeRoles(['admin', 'vendedor']), userController.getAllUsers);
router.get('/:id', verifyToken, authorizeRoles(['admin', 'vendedor']), userController.getUserById);
router.put('/:id', verifyToken, authorizeRoles(['admin', 'vendedor']), userController.getUserUpdate);
router.delete('/delete/:id', verifyToken, authorizeRoles(['admin']), userController.getUserDelete);

module.exports = router;