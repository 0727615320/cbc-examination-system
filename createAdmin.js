const bcrypt = require('bcrypt');
const db = require('./db/db'); // Adjust path if needed

const username = 'josphatmukhwana5@gmail.com';
const password = 'Confidence2030';
const role = 'admin';
const assigned_class = null; // Can be a string like "Grade 5"

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = 'INSERT INTO teachers (username, password, role, assigned_class) VALUES (?, ?, ?, ?)';
    db.query(sql, [username, hashedPassword, role, assigned_class], (err, result) => {
      if (err) {
        console.error('❌ Failed to insert admin:', err);
      } else {
        console.log('✅ Admin inserted successfully.');
      }
      process.exit(); // Exit after operation
    });
  } catch (error) {
    console.error('❌ Error hashing password:', error);
    process.exit();
  }
}

createAdmin();
