const bcrypt = require('bcrypt');
const db = require('./db/db'); // Adjust if your db path is different

const email = 'josphatmukhwana5@gmail.com';
const newPassword = 'Confidence2030';

async function resetPassword() {
  try {
    const hashed = await bcrypt.hash(newPassword, 10);
    const sql = `UPDATE teachers SET password = ? WHERE username = ?`;
    db.query(sql, [hashed, email], (err, result) => {
      if (err) {
        console.error('❌ Password update failed:', err);
      } else {
        console.log('✅ Password updated successfully!');
      }
      process.exit();
    });
  } catch (err) {
    console.error('❌ Bcrypt error:', err);
    process.exit();
  }
}

resetPassword();
