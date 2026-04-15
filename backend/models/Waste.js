const mongoose = require('mongoose');

const wasteSchema = new mongoose.Schema({
  type: String, // e.g. "plastic"
  platform: String,
  location: {
    lat: Number,
    lng: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Waste', wasteSchema);
