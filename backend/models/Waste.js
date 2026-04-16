const mongoose = require('mongoose');

const wasteSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type:      { type: String, required: true },   // 'plastic' | 'cardboard' | 'paper'
  platform:  { type: String, default: 'Other' },
  imagePath: { type: String, default: null },    // stored filename from multer
  location:  {
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Waste', wasteSchema);
