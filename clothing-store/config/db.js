const mongoose = require('mongoose');

module.exports = async function connectDB() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  await mongoose.connect(mongoUri);
  console.log('MongoDB connected');
};
