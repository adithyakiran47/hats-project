const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Hardcoded Company ID for admin/bot access
const COMPANY_ID = 'companyid1';

// Register (Applicants only - no role selection)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: 'applicant' // Always set as applicant
    });

    await newUser.save();
    
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login (All users - with Company ID check for admin/bot)
router.post('/login', async (req, res) => {
  try {
    const { email, password, companyId } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check if trying to login as admin or botmimic
    if (user.role === 'admin' || user.role === 'botmimic') {
      if (!companyId || companyId !== COMPANY_ID) {
        return res.status(403).json({ error: 'Invalid Company ID for admin/bot access' });
      }
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
