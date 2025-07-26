// middleware/auth.js

function ensureAuthenticated(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
}

function ensureAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  return res.status(403).send('Access denied. Admins only.');
}

module.exports = {
  ensureAuthenticated,
  ensureAdmin,
};
