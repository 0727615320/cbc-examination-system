const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');

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

// Make flash messages available in all EJS templates
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

// Health check route for Koyeb
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Default route redirect
app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/dashboard');
  } else {
    res.redirect('/login');
  }
});

// ✅ FINAL FIX FOR KOYEB: bind to 0.0.0.0 and process.env.PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
});
