const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'mysql',
  user: 'bobi',
  password: '123',
  database: 'TRANS',
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = pool;