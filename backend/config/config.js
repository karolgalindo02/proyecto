const mysql = require('mysql');
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // PASS equipo local bdnexsys123
  database: 'db_node',
  port: 3306
});
db.connect(function(err) {
  if (err) throw err;
  console.log('Base de datos conectada');
});
module.exports = db;