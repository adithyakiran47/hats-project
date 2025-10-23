const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables early

const app = express(); // Initialize Express app

// Middleware setup
app.use(cors());
app.use(express.json());

// Import auth middleware
const authenticateJWT = require('./middleware/authMiddleware');

// Import routes
const botMimicRoutes = require('./routes/botMimic');
const authRoutes = require('./routes/auth');
const applicationRoutes = require('./routes/application');

// Use routes with middleware
app.use('/api/botmimic', authenticateJWT, botMimicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/application', authenticateJWT, applicationRoutes);

// Connect to MongoDB without deprecated options
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Basic root route
app.get('/', (req, res) => {
  res.send('Backend is working!');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
