require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Waste = require('./models/Waste');

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const connectDB = async () => {
  try {
    // Only attempt connection if a real URI is provided, otherwise we mock it for development
    if (process.env.MONGO_URI && !process.env.MONGO_URI.includes('<username>')) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('MongoDB connection successful');
    } else {
      console.log('MongoDB connection skipped: Please provide a valid MONGO_URI in .env');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

connectDB();

// GET / -> "EcoTrack Backend Running"
app.get('/', (req, res) => {
  res.send('EcoTrack Backend Running');
});

// POST /api/waste -> Save data to MongoDB
app.post('/api/waste', async (req, res) => {
  try {
    const { type, platform, location } = req.body;
    
    // Check if we're actually connected to DB before saving
    if (mongoose.connection.readyState !== 1) {
       return res.status(201).json({ message: 'Saved (Mocked due to no DB connection)', data: { type, platform, location } });
    }
    
    const newWaste = new Waste({ type, platform, location });
    await newWaste.save();
    
    res.status(201).json({ message: 'Saved successfully', data: newWaste });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save waste data' });
  }
});

// POST /api/detect -> Return random material: ["plastic","cardboard","paper"]
app.post('/api/detect', (req, res) => {
  const materials = ['plastic', 'cardboard', 'paper'];
  const randomMaterial = materials[Math.floor(Math.random() * materials.length)];
  res.json({ material: randomMaterial });
});

// GET /api/recycling -> Return dummy centers
app.get('/api/recycling', (req, res) => {
  const centers = [
      { id: 1, name: 'Eco Hub Center', distance: '1.2 miles' },
      { id: 2, name: 'Green Path Recycling', distance: '2.5 miles' },
      { id: 3, name: 'City Waste Management', distance: '3.8 miles' },
  ];
  res.json(centers);
});

// GET /api/dashboard -> Fetch data from MongoDB and return: { totalWaste, plastic, cardboard, paper }
app.get('/api/dashboard', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
       return res.json({
         totalWaste: 42,
         plastic: 20,
         cardboard: 15,
         paper: 7
       });
    }

    const totalWaste = await Waste.countDocuments();
    const plastic = await Waste.countDocuments({ type: 'plastic' });
    const cardboard = await Waste.countDocuments({ type: 'cardboard' });
    const paper = await Waste.countDocuments({ type: 'paper' });
    
    res.json({
      totalWaste,
      plastic,
      cardboard,
      paper
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
