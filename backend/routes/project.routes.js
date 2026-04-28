const router = require('express').Router();
const auth = require('../middleware/auth');
const ProjectController = require('../controllers/projectController');

router.use(auth);
router.get('/', ProjectController.list);
router.post('/', ProjectController.create);
router.post('/join', ProjectController.joinByCode);
router.get('/:id', ProjectController.getById);
router.delete('/:id', ProjectController.remove);

module.exports = router;