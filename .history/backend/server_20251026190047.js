require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// cors configuration
const allowedOrigins = [
  'http://localhost:3000',
  'https://hats-project-git-main-adithya-kirans-projects.vercel.app',  
  'https://hats-project.vercel.app'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); 
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// mongodb connection
mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// import and register routes
const authRoutes = require('./routes/auth');
const applicationRoutes = require('./routes/application');
const jobRoutes = require('./routes/job');
const dashboardRoutes = require('./routes/dashboard');
const automationRoutes = require('./routes/automation');

app.use('/api/auth', authRoutes);
app.use('/api/application', applicationRoutes);
app.use('/api/job', jobRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/automation', automationRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'HATS API is running successfully!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
