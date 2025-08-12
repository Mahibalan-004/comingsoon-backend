// server.js
require('dotenv').config(); // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Contact = require('./models/Contact');

const app = express();

// --- Config Variables ---
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/commingsoon';
const FRONTEND_URL = process.env.FRONTEND_URL || '*'; // Example: https://yourfrontend.vercel.app

// --- Middleware ---
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || FRONTEND_URL === '*' || origin === FRONTEND_URL) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed from this origin'));
    }
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// --- MongoDB Connection ---
(async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
})();

// --- Routes ---
// Health check
app.get('/', (req, res) => {
  res.send('🚀 Backend API is running');
});

// Test route
app.get('/api/some-route', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

// Contact form submission
app.post('/api/contact', async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newContact = new Contact({ name, email, message });
    await newContact.save();

    res.status(201).json({ message: '✅ Message received successfully!' });
  } catch (err) {
    next(err);
  }
});

// --- Global Error Handler ---
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
