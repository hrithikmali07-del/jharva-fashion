const express = require('express');
const bcrypt = require('bcryptjs');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { ensureAdmin } = require('../middleware/auth');
const { productValidationRules, handleValidation } = require('../middleware/validators');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many login attempts. Please try again later.'
});

router.get('/login', (req, res) => {
  if (req.session.isAdmin) return res.redirect('/admin/dashboard');
  res.render('admin/login', { title: 'Admin Login' });
});

router.post(
  '/login',
  loginLimiter,
  [body('email').isEmail().normalizeEmail(), body('password').isLength({ min: 8, max: 200 })],
  handleValidation,
  async (req, res) => {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

    if (!adminEmail || !adminPasswordHash) {
      req.flash('error', 'Admin credentials are not configured.');
      return res.redirect('/admin/login');
    }

    const emailMatch = req.body.email === adminEmail;
    const passwordMatch = await bcrypt.compare(req.body.password, adminPasswordHash);

    if (!emailMatch || !passwordMatch) {
      req.flash('error', 'Invalid credentials.');
      return res.redirect('/admin/login');
    }

    req.session.isAdmin = true;
    req.flash('success', 'Welcome back, admin.');
    return res.redirect('/admin/dashboard');
  }
);

router.post('/logout', ensureAdmin, (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.redirect('/admin/login');
  });
});

router.get('/dashboard', ensureAdmin, async (req, res, next) => {
  try {
    const [products, orders] = await Promise.all([
      Product.find().sort({ createdAt: -1 }).lean(),
      Order.find().sort({ createdAt: -1 }).populate('items.product').lean()
    ]);

    res.render('admin/dashboard', {
      title: 'Admin Dashboard',
      products,
      orders
    });
  } catch (error) {
    next(error);
  }
});

router.post('/products', ensureAdmin, productValidationRules, handleValidation, async (req, res, next) => {
  try {
    await Product.create({
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      imageUrl: req.body.imageUrl,
      category: req.body.category,
      inStock: Number(req.body.inStock),
      featured: req.body.featured === 'on'
    });

    req.flash('success', 'Product created successfully.');
    res.redirect('/admin/dashboard');
  } catch (error) {
    if (error.code === 11000) {
      req.flash('error', 'A product with this name already exists.');
      return res.redirect('/admin/dashboard');
    }
    next(error);
  }
});

router.put('/products/:id', ensureAdmin, [body('id').optional(), ...productValidationRules], handleValidation, async (req, res, next) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      imageUrl: req.body.imageUrl,
      category: req.body.category,
      inStock: Number(req.body.inStock),
      featured: req.body.featured === 'on'
    });

    req.flash('success', 'Product updated successfully.');
    res.redirect('/admin/dashboard');
  } catch (error) {
    next(error);
  }
});

router.delete('/products/:id', ensureAdmin, async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    req.flash('success', 'Product deleted successfully.');
    res.redirect('/admin/dashboard');
  } catch (error) {
    next(error);
  }
});

router.patch('/orders/:id/ship', ensureAdmin, async (req, res, next) => {
  try {
    await Order.findByIdAndUpdate(req.params.id, { status: 'Shipped' });
    req.flash('success', 'Order marked as shipped.');
    res.redirect('/admin/dashboard');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
