const jwt = require('jsonwebtoken');


const payload = { userId: user._id, role: user.role };
const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

res.json({
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  }
});
