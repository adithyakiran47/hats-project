const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Register user
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.json({ message: 'Registration successful' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to register' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, role: user.role } });
  } catch {
    res.status(500).json({ error: 'Failed to login' });
  }
});

module.exports = router;
