const express = require("express");
const router = express.Router();
const db = require("../db/db");
const { ensureAuthenticated } = require("../middleware/auth");
const resultsController = require("../controllers/resultsController");

// ✅ Subject map by class
const subjectMap = {
  PP1: ["Language", "Mathematics", "Environmental", "Psychomotor", "CRE/IRE"],
  PP2: ["Language", "Mathematics", "Environmental", "Psychomotor", "CRE/IRE"],
  "Grade 1": ["Mathematics", "English", "Kiswahili", "Hygiene", "Environmental", "Movement", "Art", "CRE/IRE"],
  "Grade 2": ["Mathematics", "English", "Kiswahili", "Hygiene", "Environmental", "Movement", "Art", "CRE/IRE"],
  "Grade 3": ["Mathematics", "English", "Kiswahili", "Hygiene", "Environmental", "Movement", "Art", "CRE/IRE"],
  "Grade 4": ["Math", "English", "Kiswahili", "Science", "Social Studies", "Agriculture", "CRE", "Art", "PE"],
  "Grade 5": ["Math", "English", "Kiswahili", "Science", "Social Studies", "Agriculture", "CRE", "Art", "PE"],
  "Grade 6": ["Math", "English", "Kiswahili", "Science", "Social Studies", "Agriculture", "CRE", "Art", "PE"],
  "Grade 7": ["English", "Kiswahili", "Math", "Integrated Science", "Pre-Technical", "Business"],
  "Grade 8": ["English", "Kiswahili", "Math", "Integrated Science", "Pre-Technical", "Business"],
  "Grade 9": ["English", "Kiswahili", "Math", "Integrated Science", "Pre-Technical", "Business"]
};

// ✅ View all results (Admin only)
router.get("/", ensureAuthenticated, async (req, res) => {
  const { role } = req.session.user;
  if (role !== "admin") {
    req.flash("error", "Access denied. Admins only.");
    return res.redirect("/dashboard");
  }

  try {
    const [results] = await db.query(`
      SELECT r.id, r.student_id, s.full_name, s.adm_no, s.class,
             r.subject, r.performance_level, r.remarks, r.term, r.year
      FROM results r
      JOIN students s ON r.student_id = s.id
      ORDER BY s.class, s.full_name, r.subject
    `);

    res.render("results/index", {
      username: req.session.user.username,
      role,
      results
    });
  } catch (err) {
    console.error("❌ Error fetching results:", err);
    req.flash("error", "Failed to load results.");
    res.redirect("/dashboard");
  }
});

// ✅ Show results entry form
router.get("/entry", ensureAuthenticated, async (req, res) => {
  const { username, assigned_class, role } = req.session.user;
  const subjects = subjectMap[assigned_class] || [];

  try {
    const [learners] = await db.query(
      "SELECT id, full_name, adm_no FROM students WHERE class = ? ORDER BY full_name",
      [assigned_class]
    );

    res.render("results/entry", {
      username,
      role,
      assigned_class,
      subjects,
      learners,
      success: req.flash("success")[0] || null,
      error: req.flash("error")[0] || null,
    });
  } catch (err) {
    console.error("❌ Error fetching learners:", err);
    req.flash("error", "Failed to load learners.");
    res.redirect("/dashboard");
  }
});

// ✅ Save submitted results
router.post("/entry", ensureAuthenticated, resultsController.savePerformance);

// ✅ Edit student results form
router.get("/edit/:studentId", ensureAuthenticated, resultsController.getStudentResults);

// ✅ Update student results
router.post("/edit/:studentId", ensureAuthenticated, resultsController.updateStudentResults);

// ✅ Delete a specific result by ID
router.post("/delete/:id", ensureAuthenticated, resultsController.deleteResultById);

module.exports = router;
