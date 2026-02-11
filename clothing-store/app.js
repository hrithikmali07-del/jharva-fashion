const path = require('path');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const morgan = require('morgan');

const storeRoutes = require('./routes/storeRoutes');
const cartRoutes = require('./routes/cartRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'unsafe-dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 2
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI
    })
  })
);

app.use(flash());

const csrfProtection = csrf();
app.use(csrfProtection);

app.use((req, res, next) => {
  const cart = req.session.cart || {};
  const cartCount = Object.values(cart).reduce((acc, item) => acc + item.quantity, 0);

  res.locals.currentPath = req.path;
  res.locals.csrfToken = req.csrfToken();
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.cartCount = cartCount;
  res.locals.isAdmin = Boolean(req.session.isAdmin);

  next();
});

app.use('/', storeRoutes);
app.use('/cart', cartRoutes);
app.use('/checkout', checkoutRoutes);
app.use('/admin', adminRoutes);

app.use((req, res) => {
  res.status(404).render('errors/404', { title: 'Page Not Found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  if (err.code === 'EBADCSRFTOKEN') {
    req.flash('error', 'Invalid form token. Please try again.');
    return res.redirect('back');
  }
  res.status(500).render('errors/500', { title: 'Server Error' });
});

module.exports = app;
