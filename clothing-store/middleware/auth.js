module.exports.ensureAdmin = (req, res, next) => {
  if (!req.session.isAdmin) {
    req.flash('error', 'Please login as admin.');
    return res.redirect('/admin/login');
  }
  return next();
};
