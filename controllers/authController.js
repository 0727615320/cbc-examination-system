const db = require('../db/db'); // ✅ CORRECT

const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await db.execute('SELECT * FROM teachers WHERE username = ?', [username]);

    if (rows.length === 0) return res.status(401).json({ message: 'Invalid username' });

    const teacher = rows[0];
    const isMatch = await bcrypt.compare(password, teacher.password);

    if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

    req.session.user = { id: teacher.id, username: teacher.username, role: teacher.role };
    res.json({ message: 'Login successful', role: teacher.role });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.json({ message: 'Logged out' });
  });
};
