// routes/dashboard.js
const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth'); // Import middleware

// Dashboard route (protected)
router.get('/', ensureAuthenticated, (req, res) => {
  const { username, role, assigned_class } = req.session.user;

  if (role === 'admin') {
    res.render('dashboard/admin', { username, role });
  } else {
    res.render('dashboard/teacher', { username, role, assigned_class });
  }
});

module.exports = router;
