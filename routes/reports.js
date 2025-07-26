const express = require('express');
const router = express.Router();
const db = require('../db/db');
const path = require('path');
const ejs = require('ejs');
const puppeteer = require('puppeteer');
const { ensureAuthenticated } = require('../middleware/auth');

// ===================== LIST LEARNERS =====================
router.get('/', ensureAuthenticated, async (req, res) => {
  const { role, assigned_class, username } = req.session.user;

  try {
    let query = 'SELECT * FROM students';
    let params = [];

    if (role === 'teacher') {
      query += ' WHERE class = ?';
      params.push(assigned_class);
    }

    const [learners] = await db.query(query, params);
    res.render('reports', { learners, role, username });
  } catch (err) {
    console.error('Error loading learners:', err);
    res.status(500).send('Failed to load learners');
  }
});

// ===================== HELPER: Format Date (Readable) =====================
function formatDateReadable(dateValue) {
  if (!dateValue) return '';
  const date = new Date(dateValue);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

// ===================== HELPER: Fetch Report Data =====================
async function fetchReportData(studentId, term = 'Term 1', year = new Date().getFullYear()) {
  const numericTerm = isNaN(term) ? parseInt((term + '').replace(/\D/g, ''), 10) : term;

  // Get student
  const [studentRows] = await db.query('SELECT * FROM students WHERE id = ?', [studentId]);
  if (studentRows.length === 0) return null;
  const student = studentRows[0];

  // Get results and map to subjects
  const [results] = await db.query(
    `SELECT subject, cat1, cat2, performance_level, remarks
     FROM results
     WHERE student_id = ? AND term = ? AND year = ?
     ORDER BY subject`,
    [studentId, numericTerm, year]
  );

  // Convert to subjects array
  const subjects = results.map(r => ({
    name: r.subject,
    cat1: r.cat1,
    cat2: r.cat2,
    final: r.performance_level,
    remark: r.remarks
  }));

  // Get report info
  const [reportRows] = await db.query(
    `SELECT * FROM reports WHERE student_id = ? AND term = ? AND year = ? LIMIT 1`,
    [studentId, numericTerm, year]
  );

  const report = reportRows[0] || {
    term: `Term ${numericTerm}`,
    year,
    remarks_on_core_competencies: 'Shows consistent growth.',
    class_teacher_comment: 'Maintain good effort.',
    head_teacher_comment: 'Promoted to next grade.',
    opening_date: new Date(),
    closing_date: new Date(),
    class_teacher: 'Class Teacher',
    headteacher: 'Headteacher'
  };

  // Attach additional data to student
  student.term = `Term ${numericTerm}`;
  student.year = year;
  student.core_remark = report.remarks_on_core_competencies;
  student.teacher_remark = report.class_teacher_comment;
  student.headteacher_remark = report.head_teacher_comment;
  student.opening_date = formatDateReadable(report.opening_date);
  student.closing_date = formatDateReadable(report.closing_date);
  student.class_teacher = report.class_teacher;
  student.headteacher = report.headteacher;

  return { student, subjects, report };
}

// ===================== HTML REPORT VIEW =====================
router.get(['/view/:studentId/:term/:year', '/view/:studentId'], ensureAuthenticated, async (req, res) => {
  const { studentId, term, year } = req.params;
  const currentTerm = term || 'Term 1';
  const currentYear = year || new Date().getFullYear();
  const user = req.session.user;

  try {
    const data = await fetchReportData(studentId, currentTerm, currentYear);
    if (!data) {
      req.flash('error', 'Student not found.');
      return res.redirect('/reports');
    }

    const { student, subjects, report } = data;

    if (user.role === 'teacher' && student.class !== user.assigned_class) {
      return res.status(403).send('Access denied');
    }

    res.render('cbc_report', { student, subjects, report, messages: req.flash() });
  } catch (err) {
    console.error('❌ Error fetching report:', err);
    req.flash('error', 'Could not load report.');
    res.redirect('/reports');
  }
});

// ===================== PDF REPORT VIEW (Using Puppeteer) =====================
router.get(['/pdf/:studentId/:term/:year', '/pdf/:studentId'], ensureAuthenticated, async (req, res) => {
  const { studentId, term, year } = req.params;
  const currentTerm = term || 'Term 1';
  const currentYear = year || new Date().getFullYear();
  const user = req.session.user;

  try {
    const data = await fetchReportData(studentId, currentTerm, currentYear);
    if (!data) return res.status(404).send('Student not found');
    const { student, subjects, report } = data;

    if (user.role === 'teacher' && student.class !== user.assigned_class) {
      return res.status(403).send('Access denied');
    }

    // Render EJS to HTML
    const html = await ejs.renderFile(
      path.join(__dirname, '../views/cbc_report.ejs'),
      { student, subjects, report }
    );

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: 'networkidle0' });
    const buffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' }
    });

    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename=${student.full_name}_report_${currentTerm}_${currentYear}.pdf`,
      'Content-Length': buffer.length
    });
    res.send(buffer);
  } catch (err) {
    console.error('Puppeteer PDF generation error:', err);
    res.status(500).send('PDF generation error');
  }
});

module.exports = router;
