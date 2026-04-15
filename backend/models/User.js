const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  points: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  lastLoggedDate: { type: Date, default: null },
  badges: { type: [String], default: [] }
});

module.exports = mongoose.model('User', userSchema);
