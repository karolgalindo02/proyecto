const express = require('express');
const passport = require('passport');
const http = require('http');
const logger = require('morgan');
const cors = require('cors');
const usersRoutes = require('./routes/userRoutes');

const app = express();
const server = http.createServer(app);

const port = process.env.PORT || 3000;

// Middlewares globales
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

// Configuración de passport
require('./config/passport')(passport);

// Rutas
app.use('/api/users', usersRoutes);

// Configuración extra
app.disable('x-powered-by');
app.set('port', port);

// Middleware para forzar HTTPS en producción
app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https' && process.env.NODE_ENV === 'production') {
    return res.redirect('https://' + req.headers.host + req.url);
  }
  next();
});

// Servidor
server.listen(port, 'localhost', function () {
  console.log(
    'App node.js ' +
      process.pid +
      ' ejecutando en ' +
      server.address().address +
      ':' +
      server.address().port
  );
});

// Endpoints de prueba
app.get('/', (req, res) => {
  res.send('Ruta raíz del Backend');
});

app.get('/test', (req, res) => {
  res.send('Ruta TEST');
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).send(err.stack);
});