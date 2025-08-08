// server.js
require('dotenv').config(); // Load environment variables from .env

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Contact = require('./models/Contact');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/comingsoon';

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1); // Exit process if DB fails
  });

// --- Test route for frontend connection check ---
app.get('/api/some-route', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

// --- Contact form submission route ---
app.post('/api/contact', async (req, res) => {
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
    console.error("❌ Error saving contact:", err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// --- Health check endpoint ---
app.get('/', (req, res) => {
  res.send('🚀 Backend API is running');
});

// --- Start server ---
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
