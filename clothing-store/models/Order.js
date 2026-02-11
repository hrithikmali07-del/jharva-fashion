const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: String,
    price: Number,
    quantity: Number,
    imageUrl: String
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, default: '' },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    postalCode: { type: String, trim: true, default: '' },
    paymentMethod: {
      type: String,
      enum: ['COD'],
      default: 'COD'
    },
    status: {
      type: String,
      enum: ['Pending', 'Shipped'],
      default: 'Pending'
    },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true, min: 0 },
    shippingFee: { type: Number, default: 0, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
