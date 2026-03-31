import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Not authorized. No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ success: false, message: 'Token is invalid or expired.' });
    }

    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ success: false, message: 'User no longer exists.' });

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

export default protect;
