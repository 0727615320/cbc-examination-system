const express = require('express');
const router = express.Router();
const db = require('../db/db');
const { ensureAuthenticated } = require('../middleware/auth');

// 🔹 List learners for assigned class
router.get('/', ensureAuthenticated, async (req, res) => {
  const { username, role, assigned_class } = req.session.user;

  try {
    let learners = [];
    if (role === 'teacher') {
      const [rows] = await db.query("SELECT * FROM students WHERE class = ?", [assigned_class]);
      learners = rows;
    } else {
      const [rows] = await db.query("SELECT * FROM students");
      learners = rows;
    }

    res.render('learners/index', {
      username,
      role,
      assigned_class,
      learners
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading learners");
  }
});

// 🔹 Show form to add new learner
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('learners/add', {
    username: req.session.user.username,
    assigned_class: req.session.user.assigned_class
  });
});

// 🔹 Handle form submission (POST) to add learner
router.post('/add', ensureAuthenticated, async (req, res) => {
  const { adm_no, full_name, gender } = req.body;
  const assigned_class = req.session.user.assigned_class;

  try {
    await db.query(
      "INSERT INTO students (adm_no, full_name, gender, class) VALUES (?, ?, ?, ?)",
      [adm_no, full_name, gender, assigned_class]
    );
    res.redirect('/learners');
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to add learner");
  }
});

// 🔹 Show form to edit learner
router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
  const { id } = req.params;
  const [rows] = await db.query("SELECT * FROM students WHERE id = ?", [id]);
  const learner = rows[0];

  if (!learner) return res.status(404).send("Learner not found");

  res.render('learners/edit', { learner });
});

// 🔹 Handle learner update
router.post('/edit/:id', ensureAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { adm_no, full_name, gender } = req.body;

  try {
    await db.query(
      "UPDATE students SET adm_no = ?, full_name = ?, gender = ? WHERE id = ?",
      [adm_no, full_name, gender, id]
    );
    res.redirect('/learners');
  } catch (err) {
    console.error(err);
    res.status(500).send("Update failed");
  }
});

// 🔹 Delete learner
router.post('/delete/:id', ensureAuthenticated, async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM students WHERE id = ?", [id]);
    res.redirect('/learners');
  } catch (err) {
    console.error(err);
    res.status(500).send("Deletion failed");
  }
});

module.exports = router;
