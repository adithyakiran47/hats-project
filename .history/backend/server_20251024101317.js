const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected successfully');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Basic API route
app.get('/', (req, res) => {
  res.send('Backend is working!');
});

// Auth routes (no token required)
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Import the JWT auth middleware
const authenticateJWT = require('./middleware/authenticateJWT');

// Application and BotMimic routes (protected)
const applicationRoutes = require('./routes/application');
app.use('/api/application', authenticateJWT, applicationRoutes);

const botMimicRoutes = require('./routes/botMimic');
app.use('/api/botmimic', authenticateJWT, botMimicRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
