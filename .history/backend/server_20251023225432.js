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

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Import the auth middleware you must create (see next step)
const authenticateJWT = require('./middleware/authMiddleware');

// Protect application routes with JWT middleware
const applicationRoutes = require('./routes/application');
app.use('/api/application', authenticateJWT, applicationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
