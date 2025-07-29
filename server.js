const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const db = require('./db/db'); // ✅ DB connection file

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Session + Flash config
app.use(session({
  secret: 'cbc-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 2 * 60 * 60 * 1000 } // 2 hours
}));
app.use(flash());

// Flash message access in all views
app.use((req, res, next) => {
  res.locals.messages = {
    success: req.flash('success'),
    error: req.flash('error')
  };
  next();
});

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const dashboardRoute = require('./routes/dashboard');
const teachersRoute = require('./routes/teachers');
const learnersRoutes = require('./routes/learners');
const resultsRoutes = require('./routes/results');
const reportsRoutes = require('./routes/reports');

// Register routes
app.use('/', indexRoutes);
app.use('/', authRoutes);
app.use('/dashboard', dashboardRoute);
app.use('/teachers', teachersRoute);
app.use('/learners', learnersRoutes);
app.use('/results', resultsRoutes);
app.use('/reports', reportsRoutes);

// Health check for Koyeb
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// ✅ TEMPORARY DEBUG ROUTE
app.get('/debug-results', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM results');
    res.json(rows);
  } catch (err) {
    console.error('❌ Error fetching results:', err);
    res.status(500).send('Database error');
  }
});

// Default route redirect
app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/dashboard');
  } else {
    res.redirect('/login');
  }
});

// ✅ Koyeb port binding
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
});
