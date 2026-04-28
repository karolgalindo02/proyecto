const router = require('express').Router();
const auth = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const UserController = require('../controllers/userController');

router.use(auth);
router.put('/me',                                UserController.updateProfile);
router.post('/me/image', upload.single('image'), UserController.uploadImage);
router.delete('/me/image',                       UserController.removeImage);

module.exports = router;