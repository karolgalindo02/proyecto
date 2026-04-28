// src/config/db.js — Pool de conexiones MySQL (promise-based)
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'db_node',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true,
});

pool.getConnection()
  .then((c) => { console.log('✅ MySQL conectado a', process.env.DB_NAME); c.release(); })
  .catch((e) => console.error('❌ Error MySQL:', e.message));

module.exports = pool;
