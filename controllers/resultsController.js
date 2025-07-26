const db = require('../db/db');

// ================== CREATE or UPDATE (Save results + comments) ==================
exports.savePerformance = async (req, res) => {
  const {
    student_id,
    term,
    year,
    totalSubjects,
    opening_date,
    closing_date,
    remarks_on_core_competencies,
    class_teacher_comment,
    head_teacher_comment,
    class_teacher,
    headteacher
  } = req.body;

  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    // === 1. Insert or Update Report (comments + dates only) ===
    const [existingReport] = await connection.query(
      `SELECT id FROM reports WHERE student_id = ? AND term = ? AND year = ? LIMIT 1`,
      [student_id, term, year]
    );

    if (existingReport.length === 0) {
      await connection.query(
        `INSERT INTO reports
         (student_id, term, year, opening_date, closing_date,
          remarks_on_core_competencies, class_teacher_comment,
          head_teacher_comment, class_teacher, headteacher)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          student_id,
          term,
          year,
          opening_date,
          closing_date,
          remarks_on_core_competencies || '',
          class_teacher_comment || '',
          head_teacher_comment || '',
          class_teacher || '',
          headteacher || 'Josphat Munyasia'
        ]
      );
    } else {
      await connection.query(
        `UPDATE reports
         SET opening_date = ?, closing_date = ?, remarks_on_core_competencies = ?,
             class_teacher_comment = ?, head_teacher_comment = ?,
             class_teacher = ?, headteacher = ?
         WHERE student_id = ? AND term = ? AND year = ?`,
        [
          opening_date,
          closing_date,
          remarks_on_core_competencies || '',
          class_teacher_comment || '',
          head_teacher_comment || '',
          class_teacher || '',
          headteacher || 'Josphat Munyasia',
          student_id,
          term,
          year
        ]
      );
    }

    // === 2. Insert/Update Results (results table) ===
    for (let i = 0; i < totalSubjects; i++) {
      const subject = req.body[`subject_${i}`];
      const cat1 = parseInt(req.body[`cat1_${i}`], 10) || 0;
      const cat2 = parseInt(req.body[`cat2_${i}`], 10) || 0;
      const final = Math.round((cat1 + cat2) / 2);

      const remarks =
        final === 1 ? "Below Expectation" :
        final === 2 ? "Approaching Expectation" :
        final === 3 ? "Meeting Expectation" :
        "Exceeding Expectation";

      await connection.query(
        `INSERT INTO results (student_id, subject, cat1, cat2, performance_level, remarks, term, year)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
            cat1 = VALUES(cat1),
            cat2 = VALUES(cat2),
            performance_level = VALUES(performance_level),
            remarks = VALUES(remarks)`,
        [student_id, subject, cat1, cat2, final, remarks, term, year]
      );
    }

    await connection.commit();
    req.flash('success', '✅ Results and comments saved successfully.');
    res.redirect('/results/entry');
  } catch (err) {
    await connection.rollback();
    console.error('❌ Error saving results and comments:', err);
    req.flash('error', '❌ Failed to save results and comments.');
    res.redirect('/results/entry');
  } finally {
    connection.release();
  }
};

// ================== READ (Get student results for editing) ==================
exports.getStudentResults = async (req, res) => {
  const studentId = req.params.studentId;

  try {
    const [results] = await db.query(
      `SELECT r.*, s.full_name AS student_name, s.adm_no
       FROM results r
       JOIN students s ON r.student_id = s.id
       WHERE r.student_id = ?
       ORDER BY r.subject ASC`,
      [studentId]
    );

    if (results.length === 0) {
      req.flash('error', '❌ No results found for this student.');
      return res.redirect('/results');
    }

    const [report] = await db.query(
      'SELECT * FROM reports WHERE student_id = ? ORDER BY created_at DESC LIMIT 1',
      [studentId]
    );

    res.render('results/edit', {
      results,
      report: report[0] || {},  // Always provide a report object
      messages: req.flash()
    });
  } catch (err) {
    console.error('❌ Database error:', err);
    req.flash('error', '❌ Database error.');
    res.redirect('/results');
  }
};

// ================== UPDATE (Bulk update for student) ==================
exports.updateStudentResults = async (req, res) => {
  const studentId = req.params.studentId;
  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    const totalSubjects = parseInt(req.body.totalSubjects, 10);

    // Update results table
    const sql = `
      UPDATE results
      SET cat1 = ?, cat2 = ?, performance_level = ?, remarks = ?
      WHERE student_id = ? AND subject = ?
    `;

    for (let i = 0; i < totalSubjects; i++) {
      const subject = req.body[`subject_${i}`];
      const cat1 = parseInt(req.body[`cat1_${i}`], 10) || 0;
      const cat2 = parseInt(req.body[`cat2_${i}`], 10) || 0;
      const final = Math.round((cat1 + cat2) / 2);

      const remarks =
        final === 1 ? "Below Expectation" :
        final === 2 ? "Approaching Expectation" :
        final === 3 ? "Meeting Expectation" :
        "Exceeding Expectation";

      await connection.query(sql, [cat1, cat2, final, remarks, studentId, subject]);
    }

    // Update report info
    await connection.query(
      `UPDATE reports
       SET opening_date = ?, closing_date = ?, remarks_on_core_competencies = ?, 
           class_teacher_comment = ?, head_teacher_comment = ?, 
           class_teacher = ?, headteacher = ?
       WHERE student_id = ? AND term = ? AND year = ?`,
      [
        req.body.opening_date,
        req.body.closing_date,
        req.body.remarks_on_core_competencies,
        req.body.class_teacher_comment,
        req.body.head_teacher_comment,
        req.body.class_teacher,
        req.body.headteacher,
        studentId,
        req.body.term,
        req.body.year
      ]
    );

    await connection.commit();
    req.flash('success', '✅ Results and comments updated successfully.');
    res.redirect(`/results/edit/${studentId}`);
  } catch (err) {
    await connection.rollback();
    console.error('❌ Bulk update failed:', err);
    req.flash('error', '❌ Failed to update results.');
    res.redirect(`/results/edit/${studentId}`);
  } finally {
    connection.release();
  }
};

// ================== DELETE (Delete by Subject for Student) ==================
exports.deleteStudentResult = async (req, res) => {
  const { studentId, subject } = req.params;

  try {
    await db.query(
      "DELETE FROM results WHERE student_id = ? AND subject = ?",
      [studentId, decodeURIComponent(subject)]
    );

    req.flash("success", `Deleted result for subject "${subject}"`);
    res.redirect(`/results/edit/${studentId}`);
  } catch (err) {
    console.error("❌ Error deleting result:", err);
    req.flash("error", "Failed to delete result.");
    res.redirect(`/results/edit/${studentId}`);
  }
};

// ================== DELETE (Admin deletes any result by ID) ==================
exports.deleteResultById = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM results WHERE id = ?", [id]);
    req.flash("success", "Result deleted successfully.");
    res.redirect("/results");
  } catch (err) {
    console.error("❌ Error deleting result:", err);
    req.flash("error", "Failed to delete result.");
    res.redirect("/results");
  }
};
