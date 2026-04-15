require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Waste = require('./models/Waste');
const User = require('./models/User');

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

// POST /api/signup -> Save user to MongoDB
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (mongoose.connection.readyState !== 1) {
       return res.status(201).json({ message: 'User created (Mocked due to no DB connection)', data: { name, email } });
    }
    
    const newUser = new User({ name, email, password });
    await newUser.save();
    
    res.status(201).json({ message: 'User created successfully', data: newUser });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// POST /api/login -> Validate user against MongoDB
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (mongoose.connection.readyState !== 1) {
       // Mock success if no DB
       return res.status(200).json({ message: 'Login successful (Mocked)', user: { email, name: email.split('@')[0] } });
    }

    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.status(200).json({ message: 'Login successful', user: { email: user.email, name: user.name } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process login' });
  }
});

// GET /api/waste -> Fetch all waste entries
app.get('/api/waste', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
       return res.json([
         { _id: '1', type: 'plastic', platform: 'Amazon', createdAt: new Date().toISOString() },
         { _id: '2', type: 'cardboard', platform: 'eBay', createdAt: new Date(Date.now() - 86400000).toISOString() },
         { _id: '3', type: 'paper', platform: 'Walmart', createdAt: new Date(Date.now() - 172800000).toISOString() },
         { _id: '4', type: 'plastic', platform: 'Other', createdAt: new Date(Date.now() - 604800000).toISOString() }
       ]);
    }
    const wastes = await Waste.find().sort({ createdAt: -1 });
    res.json(wastes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch waste entries' });
  }
});

// GET /api/trend -> Fetch waste entries grouped by day of week
app.get('/api/trend', async (req, res) => {
  try {
    const defaultWeek = [
      { name: "Mon", plastic: 0, cardboard: 0, paper: 0 },
      { name: "Tue", plastic: 0, cardboard: 0, paper: 0 },
      { name: "Wed", plastic: 0, cardboard: 0, paper: 0 },
      { name: "Thu", plastic: 0, cardboard: 0, paper: 0 },
      { name: "Fri", plastic: 0, cardboard: 0, paper: 0 },
      { name: "Sat", plastic: 0, cardboard: 0, paper: 0 },
      { name: "Sun", plastic: 0, cardboard: 0, paper: 0 }
    ];

    if (mongoose.connection.readyState !== 1) {
       return res.json(defaultWeek);
    }

    const wastes = await Waste.find();
    
    wastes.forEach(waste => {
      let dayIndex = new Date(waste.createdAt).getDay();
      let mappedIndex = dayIndex === 0 ? 6 : dayIndex - 1; // Map to Mon=0...Sun=6

      if (waste.type === 'plastic') defaultWeek[mappedIndex].plastic++;
      else if (waste.type === 'cardboard') defaultWeek[mappedIndex].cardboard++;
      else if (waste.type === 'paper') defaultWeek[mappedIndex].paper++;
    });

    res.json(defaultWeek);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trend data' });
  }
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
