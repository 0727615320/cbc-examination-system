const db = require('../db/db');

// GET full report by student ID, term, and year
exports.getReportByStudent = async (req, res) => {
  const { studentId } = req.params;
  const { term, year } = req.query;

  try {
    // Get report metadata from 'reports' table
    const [reportRows] = await db.promise().query(
      `SELECT * FROM reports WHERE student_id = ? AND term = ? AND year = ?`,
      [studentId, term, year]
    );

    if (reportRows.length === 0) {
      req.flash('error', 'No report found for this student.');
      return res.redirect('/reports');
    }

    const report = reportRows[0];

    // Get performance entries for this student, term, year
    const [performanceRows] = await db.promise().query(
      `SELECT subject, level FROM performance WHERE adm_no = (
         SELECT adm_no FROM students WHERE id = ?
       ) AND term = ? AND year = ?`,
      [studentId, term, year]
    );

    // Get student info
    const [studentRows] = await db.promise().query(
      `SELECT full_name, adm_no, class FROM students WHERE id = ?`,
      [studentId]
    );

    const student = studentRows[0];

    res.render('cbc_reports', {
      student,
      report,
      performances: performanceRows,
    });

  } catch (err) {
    console.error('Error fetching report:', err);
    req.flash('error', 'Something went wrong while loading the report.');
    res.redirect('/reports');
  }
};
