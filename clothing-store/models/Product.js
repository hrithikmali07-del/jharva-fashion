const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    slug: {
      type: String,
      unique: true,
      index: true
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      default: 'Kurti'
    },
    featured: {
      type: Boolean,
      default: false
    },
    inStock: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  { timestamps: true }
);

productSchema.pre('validate', function createSlug(next) {
  if (this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true, trim: true });
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
