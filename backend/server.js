require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Waste = require('./models/Waste');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'eco_track_secret_super_key';

const connectDB = async () => {
  try {
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

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (mongoose.connection.readyState !== 1 && !token) {
    req.user = { id: 'mockUserId' };
    return next();
  }

  if (!token) return res.status(401).json({ error: 'Access denied: No token provided' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Access denied: Invalid token' });
    req.user = user;
    next();
  });
};

app.get('/', (req, res) => {
  res.send('EcoTrack Backend Running Securely');
});

app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });

    if (mongoose.connection.readyState !== 1) {
       return res.status(201).json({ success: true, token: 'mockToken', user: { name, email }});
    }
    
    const existing = await User.findOne({ email });
    if(existing) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    
    const token = jwt.sign({ id: newUser._id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ success: true, message: 'User created', token, user: { name: newUser.name, email: newUser.email } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Credentials required' });

    if (mongoose.connection.readyState !== 1) {
       return res.status(200).json({ success: true, token: 'mockToken', user: { email, name: email.split('@')[0] } });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const validPass = await bcrypt.compare(password, user.password);
    if(!validPass) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ success: true, message: 'Login successful', token, user: { name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process login' });
  }
});

app.get('/api/waste', authenticateToken, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
       return res.json([
         { _id: '1', type: 'plastic', platform: 'Amazon', createdAt: new Date().toISOString() },
         { _id: '2', type: 'cardboard', platform: 'eBay', createdAt: new Date(Date.now() - 86400000).toISOString() }
       ]);
    }
    const wastes = await Waste.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(wastes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch waste entries' });
  }
});

app.post('/api/waste', authenticateToken, async (req, res) => {
  try {
    const { type, platform, location } = req.body;
    
    if (mongoose.connection.readyState !== 1) {
       return res.status(201).json({ message: 'Saved (Mocked)', data: { type, platform } });
    }
    
    const newWaste = new Waste({ userId: req.user.id, type, platform, location });
    await newWaste.save();
    
    res.status(201).json({ message: 'Saved successfully', data: newWaste });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save waste data' });
  }
});

app.get('/api/trend', authenticateToken, async (req, res) => {
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

    if (mongoose.connection.readyState !== 1) return res.json(defaultWeek);

    const wastes = await Waste.find({ userId: req.user.id });
    
    wastes.forEach(waste => {
      let dayIndex = new Date(waste.createdAt).getDay();
      let mappedIndex = dayIndex === 0 ? 6 : dayIndex - 1; 

      if (waste.type === 'plastic') defaultWeek[mappedIndex].plastic++;
      else if (waste.type === 'cardboard') defaultWeek[mappedIndex].cardboard++;
      else if (waste.type === 'paper') defaultWeek[mappedIndex].paper++;
    });

    res.json(defaultWeek);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trend' });
  }
});

app.get('/api/dashboard', authenticateToken, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
       return res.json({ totalWaste: 42, plastic: 20, cardboard: 15, paper: 7 });
    }

    const totalWaste = await Waste.countDocuments({ userId: req.user.id });
    const plastic = await Waste.countDocuments({ userId: req.user.id, type: 'plastic' });
    const cardboard = await Waste.countDocuments({ userId: req.user.id, type: 'cardboard' });
    const paper = await Waste.countDocuments({ userId: req.user.id, type: 'paper' });
    
    res.json({ totalWaste, plastic, cardboard, paper });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard' });
  }
});

app.get('/api/recycling', (req, res) => {
  const centers = [
      { id: 1, name: 'Eco Hub Center', distance: '1.2 miles' },
      { id: 2, name: 'Green Path Recycling', distance: '2.5 miles' },
      { id: 3, name: 'City Waste Management', distance: '3.8 miles' },
  ];
  res.json(centers);
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
