const fs = require('fs');
const path = require('path');
const multer = require('multer');

const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads', 'avatars');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase().slice(0, 5) || '.jpg';
    const userId = req.user?.id || 'anon';
    cb(null, `user_${userId}_${Date.now()}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error('Solo se permiten imágenes (jpg/png/webp)'));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 4 * 1024 * 1024 }, // 4 MB
});

module.exports = { upload, UPLOAD_DIR };