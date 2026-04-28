const router = require('express').Router();
const auth = require('../middleware/auth');
const ChatbotController = require('../controllers/chatbotController');

router.use(auth);
router.post('/message', ChatbotController.sendMessage);
router.get('/history', ChatbotController.history);
router.get('/sessions', ChatbotController.listSessions);
router.post('/generate-project', ChatbotController.generateProject);

module.exports = router;