const mysql = require('mysql2/promise');  // ✅ use promise version

const sslOptions = process.env.DB_SSL === 'true' ? {
  ssl: {
    ca: process.env.MYSQL_CA_PEM
  }
} : {};

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ...sslOptions
});

module.exports = pool;
