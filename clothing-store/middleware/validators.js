const { body, validationResult, param } = require('express-validator');

const clean = (value) => (typeof value === 'string' ? value.trim() : value);

exports.productValidationRules = [
  body('name').customSanitizer(clean).isLength({ min: 2, max: 120 }).escape(),
  body('description').customSanitizer(clean).isLength({ min: 10, max: 2000 }).escape(),
  body('price').isFloat({ min: 0 }),
  body('imageUrl').customSanitizer(clean).isURL(),
  body('category').customSanitizer(clean).optional({ values: 'falsy' }).isLength({ max: 50 }).escape(),
  body('inStock').isInt({ min: 0 }),
  body('featured').optional().isIn(['on'])
];

exports.checkoutValidationRules = [
  body('customerName').customSanitizer(clean).isLength({ min: 2, max: 80 }).escape(),
  body('phone').customSanitizer(clean).matches(/^[0-9+\-\s]{7,20}$/),
  body('email').customSanitizer(clean).optional({ values: 'falsy' }).isEmail().normalizeEmail(),
  body('address').customSanitizer(clean).isLength({ min: 8, max: 300 }).escape(),
  body('city').customSanitizer(clean).isLength({ min: 2, max: 80 }).escape(),
  body('postalCode').customSanitizer(clean).optional({ values: 'falsy' }).isLength({ min: 3, max: 20 }).escape()
];

exports.productParamRule = [param('slug').isSlug()];

exports.handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', errors.array().map((e) => e.msg).join(', '));
    return res.redirect('back');
  }
  next();
};
