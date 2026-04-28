require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('./config/passport');

const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/project.routes');
const taskRoutes = require('./routes/task.routes');
const chatbotRoutes = require('./routes/chatbot.routes');
const notificationRoutes = require('./routes/notification.routes');
const userRoutes = require('./routes/user.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(passport.initialize());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'takio' }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/notifications', notificationRoutes);

app.use((req, res) => res.status(404).json({ success: false, message: 'Ruta no encontrada' }));

app.use((err, _req, res, _next) => {
  console.error('Error global:', err.message);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Error servidor' });
});

app.listen(PORT, () => {
  console.log(`🚀 Takio backend corriendo en http://localhost:${PORT}`);
});