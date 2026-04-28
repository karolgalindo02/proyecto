const router = require('express').Router();
const auth = require('../middleware/auth');
const TaskController = require('../controllers/taskController');

router.use(auth);
router.get('/dashboard/summary', TaskController.dashboardSummary);
router.get('/', TaskController.list);
router.post('/', TaskController.create);
router.put('/:id', TaskController.update);
router.delete('/:id', TaskController.remove);

module.exports = router;