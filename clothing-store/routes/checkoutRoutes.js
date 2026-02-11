const express = require('express');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { checkoutValidationRules, handleValidation } = require('../middleware/validators');
const { getCartWithTotals } = require('../utils/cart');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const cartData = await getCartWithTotals(req.session.cart, Product);
    if (!cartData.items.length) {
      req.flash('error', 'Your cart is empty.');
      return res.redirect('/shop');
    }
    res.render('checkout/checkout', { title: 'Checkout', cartData });
  } catch (error) {
    next(error);
  }
});

router.post('/', checkoutValidationRules, handleValidation, async (req, res, next) => {
  try {
    const cartData = await getCartWithTotals(req.session.cart, Product);
    if (!cartData.items.length) {
      req.flash('error', 'Your cart is empty.');
      return res.redirect('/shop');
    }

    const order = await Order.create({
      customerName: req.body.customerName,
      phone: req.body.phone,
      email: req.body.email,
      address: req.body.address,
      city: req.body.city,
      postalCode: req.body.postalCode,
      paymentMethod: 'COD',
      items: cartData.items.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        imageUrl: item.product.imageUrl
      })),
      subtotal: cartData.subtotal,
      shippingFee: cartData.shippingFee,
      totalAmount: cartData.total
    });

    req.session.cart = {};
    req.flash('success', `Order #${order._id.toString().slice(-6)} placed successfully with Cash on Delivery.`);
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
