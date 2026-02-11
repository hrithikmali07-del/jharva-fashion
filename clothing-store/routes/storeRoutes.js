const express = require('express');
const Product = require('../models/Product');
const { productParamRule, handleValidation } = require('../middleware/validators');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const featuredProducts = await Product.find({ featured: true }).sort({ createdAt: -1 }).limit(6).lean();
    const latestProducts = await Product.find().sort({ createdAt: -1 }).limit(8).lean();
    res.render('store/home', {
      title: 'Jharva Fashion | Premium Ethnic Wear',
      featuredProducts,
      latestProducts
    });
  } catch (error) {
    next(error);
  }
});

router.get('/shop', async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    res.render('store/shop', { title: 'Shop', products });
  } catch (error) {
    next(error);
  }
});

router.get('/product/:slug', productParamRule, handleValidation, async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).lean();
    if (!product) {
      return res.status(404).render('errors/404', { title: 'Product Not Found' });
    }

    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id }
    })
      .limit(4)
      .lean();

    res.render('store/product-detail', {
      title: product.name,
      product,
      relatedProducts
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
