// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db/db');

// GET /login
router.get('/login', (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  res.render('teacher-login', { error: null });
});

// POST /login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM teachers WHERE username = ?', [username]);

    if (rows.length === 0) {
      return res.render('teacher-login', { error: 'User not found' });
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.render('teacher-login', { error: 'Incorrect password' });
    }

    req.session.user = {
      id: user.id,
      username: user.username,
      role: user.role,
      assigned_class: user.assigned_class,
    };

    console.log(`✅ Logged in as ${user.username} (${user.role})`);
    res.redirect('/dashboard');
  } catch (err) {
    console.error('❌ Login error:', err);
    res.render('teacher-login', { error: 'Server error' });
  }
});

// GET /logout
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Logout error:', err);
      return res.send('Error logging out');
    }
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
});

module.exports = router;
