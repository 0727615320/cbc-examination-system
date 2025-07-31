async function fetchReportData(studentId, term, year) {
  const numericTerm = term.replace(/\D/g, '');

  try {
    // 1. Get student info
    const [studentRows] = await db.query(
      `SELECT full_name, adm_no, class FROM students WHERE id = ?`,
      [studentId]
    );
    if (studentRows.length === 0) return null;
    const student = studentRows[0];

    // 2. Get results per subject
    const [results] = await db.query(`
      SELECT r.subject, r.cat1, r.cat2, r.performance_level, r.remarks
      FROM results r
      INNER JOIN (
        SELECT subject, MAX(id) AS latest_id
        FROM results
        WHERE student_id = ? AND term = ? AND year = ?
        GROUP BY subject
      ) latest ON r.id = latest.latest_id
    `, [studentId, numericTerm, year]);

    // 3. Get overall report data
    const [reportRows] = await db.query(`
      SELECT core_competencies, class_teacher_comments, head_teacher_comments, opening_date, closing_date
      FROM reports
      WHERE student_id = ? AND term = ? AND year = ?
      ORDER BY id DESC LIMIT 1
    `, [studentId, numericTerm, year]);

    return {
      student,
      results,
      report: reportRows.length ? reportRows[0] : null
    };

  } catch (err) {
    console.error('Error in fetchReportData:', err);
    throw err;
  }
}
