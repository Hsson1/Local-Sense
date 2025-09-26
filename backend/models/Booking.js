const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  experience: { type: mongoose.Schema.Types.ObjectId, ref: 'Experience' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  totalPrice: Number,
  status: { type: String, enum: ['pending','paid','cancelled','completed'], default: 'pending' },
  date: Date,
  createdAt: { type: Date, default: Date.now },
  stripeSessionId: String
});

module.exports = mongoose.model('Booking', BookingSchema);
