const mysql = require('mysql2');
const fs = require('fs'); // Ensure 'fs' is available
require('dotenv').config(); // ⬅️ Add this if using a .env file

const connection = mysql.createConnection({
  host: 'mysql-28b507a6-josphatmukhwana5-6d57.c.aivencloud.com',
  port: 12456,
  user: 'avnadmin',
  password: process.env.DB_PASS, // ✅ Use environment variable here
  database: 'defaultdb',
  ssl: {
    ca: fs.readFileSync('./certs/ca.pem') // ✅ Ensure this path is correct
  }
});

connection.connect((err) => {
  if (err) {
    return console.error('❌ Connection failed:', err.message);
  }
  console.log('✅ Connected to Aiven MySQL!');

  connection.query('SELECT NOW() AS now', (err, results) => {
    if (err) throw err;
    console.log('🕒 Server time is:', results[0].now);
    connection.end();
  });
});
