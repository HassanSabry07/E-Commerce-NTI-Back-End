const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// ─── Protect (authenticate) ───────────────────────────────────────────────────
exports.protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    // ✅ decoded.id مش decoded._id
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'Invalid user data' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// ─── Restrict To (authorize) ──────────────────────────────────────────────────
exports.restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'You are not allowed to do this action' });
  }
  next();
};