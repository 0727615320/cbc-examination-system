const express = require('express');
const router = express.Router();
const db = require('../db/db');
const bcrypt = require('bcryptjs');
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth');

// ✅ Class options used in forms
const classOptions = [
  'Play Group', 'PP1', 'PP2',
  'Grade 1', 'Grade 2', 'Grade 3',
  'Grade 4', 'Grade 5', 'Grade 6',
  'Grade 7', 'Grade 8', 'Grade 9'
];

// GET all teachers
router.get('/', ensureAuthenticated, ensureAdmin, async (req, res) => {
  const [rows] = await db.query('SELECT * FROM teachers');
  const { username, role } = req.session.user;

  res.render('teachers/index', {
    teachers: rows,
    username,
    role
  });
});

// Add teacher
router.post('/', ensureAuthenticated, ensureAdmin, async (req, res) => {
  const { username, password, role, assigned_class } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  await db.query(
    'INSERT INTO teachers (username, password, role, assigned_class) VALUES (?, ?, ?, ?)',
    [username, hashed, role, assigned_class || null]
  );

  res.redirect('/teachers');
});

// Show edit form
router.get('/edit/:id', ensureAuthenticated, ensureAdmin, async (req, res) => {
  const { id } = req.params;
  const [rows] = await db.query('SELECT * FROM teachers WHERE id = ?', [id]);

  if (rows.length === 0) return res.send('Teacher not found');

  const { username, role } = req.session.user;

  res.render('teachers/edit', {
    teacher: rows[0],
    username,
    role,
    classOptions // ✅ Send classOptions to the view
  });
});

// Handle edit submission
router.post('/edit/:id', ensureAuthenticated, ensureAdmin, async (req, res) => {
  const { id } = req.params;
  const { username, password, role, assigned_class } = req.body;

  try {
    let query = 'UPDATE teachers SET username = ?, role = ?, assigned_class = ?';
    const params = [username, role, assigned_class || null];

    // If password is provided, hash and include it
    if (password && password.trim() !== '') {
      const hashed = await bcrypt.hash(password, 10);
      query += ', password = ?';
      params.push(hashed);
    }

    query += ' WHERE id = ?';
    params.push(id);

    await db.query(query, params);
    res.redirect('/teachers');
  } catch (err) {
    console.error('❌ Error updating teacher:', err);
    res.status(500).send('Server Error');
  }
});

// Delete teacher
router.get('/delete/:id', ensureAuthenticated, ensureAdmin, async (req, res) => {
  const { id } = req.params;
  await db.query('DELETE FROM teachers WHERE id = ?', [id]);
  res.redirect('/teachers');
});

module.exports = router;
