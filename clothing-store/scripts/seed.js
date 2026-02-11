require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Product = require('../models/Product');

const products = [
  {
    name: 'Ivory Floral Anarkali Kurti',
    description: 'Flowy anarkali silhouette with delicate floral print and handcrafted yoke detailing for elevated everyday elegance.',
    price: 1899,
    imageUrl: 'https://images.unsplash.com/photo-1610030469668-73b8bd891b29?auto=format&fit=crop&w=900&q=80',
    category: 'Kurti',
    featured: true,
    inStock: 15
  },
  {
    name: 'Midnight Indigo Straight Kurti',
    description: 'Minimal straight-fit kurti in rich indigo tones with subtle geometric motifs and breathable cotton feel.',
    price: 1499,
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80',
    category: 'Kurti',
    featured: true,
    inStock: 20
  },
  {
    name: 'Saffron Festive Embroidered Set',
    description: 'A festive-ready kurti set with tasteful threadwork and luxe texture designed for statement celebrations.',
    price: 2599,
    imageUrl: 'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?auto=format&fit=crop&w=900&q=80',
    category: 'Festive',
    featured: true,
    inStock: 8
  },
  {
    name: 'Rose Blush Everyday Kurta',
    description: 'Soft rose hues and clean finishing deliver effortless style for brunches, office days, and casual gatherings.',
    price: 1299,
    imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
    category: 'Casual',
    featured: false,
    inStock: 25
  }
];

(async () => {
  try {
    await connectDB();
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log('Products seeded successfully');
  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
})();
