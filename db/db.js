// db/db.js
const mysql = require('mysql2/promise'); // ✅ PROMISE VERSION

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Confidence2030',  // ✅ Your actual MySQL password
  database: 'cbc_mis'
});

module.exports = db;
