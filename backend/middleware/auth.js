import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'focusflow_secret_key_2024';

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, msg: 'Not authorized, no token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, msg: 'Token is invalid or expired' });
  }
};

export default protect;
