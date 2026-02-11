const express = require('express');
const { body } = require('express-validator');
const Product = require('../models/Product');
const { handleValidation } = require('../middleware/validators');
const { getCartWithTotals } = require('../utils/cart');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const cartData = await getCartWithTotals(req.session.cart, Product);
    res.render('cart/cart', { title: 'Your Cart', cartData });
  } catch (error) {
    next(error);
  }
});

router.post(
  '/add',
  [body('productId').isMongoId(), body('quantity').optional().isInt({ min: 1, max: 10 })],
  handleValidation,
  async (req, res, next) => {
    try {
      const { productId } = req.body;
      const quantity = Number(req.body.quantity || 1);
      const product = await Product.findById(productId).lean();

      if (!product) {
        req.flash('error', 'Product not found.');
        return res.redirect('/shop');
      }

      req.session.cart = req.session.cart || {};
      const current = req.session.cart[productId]?.quantity || 0;
      req.session.cart[productId] = { quantity: Math.min(current + quantity, 10) };

      req.flash('success', `${product.name} added to cart.`);
      return res.redirect('/cart');
    } catch (error) {
      return next(error);
    }
  }
);

router.post('/update', [body('productId').isMongoId(), body('quantity').isInt({ min: 0, max: 10 })], handleValidation, (req, res) => {
  const { productId } = req.body;
  const quantity = Number(req.body.quantity || 0);
  req.session.cart = req.session.cart || {};

  if (quantity <= 0) {
    delete req.session.cart[productId];
  } else {
    req.session.cart[productId] = { quantity };
  }

  req.flash('success', 'Cart updated successfully.');
  res.redirect('/cart');
});

router.post('/remove', [body('productId').isMongoId()], handleValidation, (req, res) => {
  const { productId } = req.body;
  req.session.cart = req.session.cart || {};
  delete req.session.cart[productId];
  req.flash('success', 'Item removed from cart.');
  res.redirect('/cart');
});

module.exports = router;
