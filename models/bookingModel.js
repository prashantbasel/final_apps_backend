const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  contactNumber: { type: String },
  bookingDate: { type: Date },
  bookingTime: { type: String },
  status: { type: String, default: 'pending' },
  bikeNumber: { type: String },
});

const Booking = mongoose.model('booking', bookingSchema);

module.exports = Booking;
