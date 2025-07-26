// controllers/dashboardController.js

const db = require('../db/db'); // ✅ CORRECT


// Get dashboard data
exports.getDashboard = (req, res) => {
  const user = req.session.user;

  if (!user) return res.redirect('/login');

  let sql, params;

  if (user.role === 'admin') {
    // Admin sees everything
    sql = `SELECT id, full_name, class_level, adm_no FROM students ORDER BY class_level, full_name`;
    params = [];
  } else {
    // Teacher sees only their class
    sql = `SELECT id, full_name, class_level, adm_no FROM students WHERE class_level = ? ORDER BY full_name`;
    params = [user.assigned_class];
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).send("Error fetching dashboard data");
    
    // For now just send JSON; later we'll render a view
    res.json({
      user: { name: user.username, role: user.role, class: user.assigned_class },
      students: results
    });
  });
};
