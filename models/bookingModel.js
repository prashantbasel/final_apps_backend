const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  bikeId: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
  description: { type: String },
  bookingDate: { type: Date },
  bookingTime: { type: String },
  status: { type: String, default: 'pending' },
  bikeNumber: { type: String },
 
  // If user-specific bookings are needed
});

const Cart = mongoose.model('booking', bookingSchema);

module.exports = Cart;