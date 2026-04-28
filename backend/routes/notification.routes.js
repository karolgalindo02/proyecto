const router = require('express').Router();
const auth = require('../middleware/auth');
const NotificationController = require('../controllers/NotificationController');

router.use(auth);
router.get('/',                NotificationController.list);
router.get('/unread-count',    NotificationController.unreadCount);
router.patch('/:id/read',      NotificationController.markRead);
router.post('/read-all',       NotificationController.markAllRead);
router.delete('/:id',          NotificationController.remove);

module.exports = router;