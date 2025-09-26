const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  passwordHash: String,
  role: { type: String, enum: ['user','host','admin'], default: 'user' },
  verifiedHost: { type: Boolean, default: false },
  bio: String,
  avatarUrl: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
