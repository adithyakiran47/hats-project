const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Register route
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role: 'applicant' });
    await user.save();
    res.json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, role: user.role } });
  } catch {
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
