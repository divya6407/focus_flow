import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userStore from '../data/userdata.js';

const JWT_SECRET = process.env.JWT_SECRET || 'focusflow_secret_key_2024';

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, msg: 'Name, email and password are required' });
  }

  const existing = userStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ success: false, msg: 'An account with this email already exists' });
  }

  if (password.length < 6) {
    return res.status(400).json({ success: false, msg: 'Password must be at least 6 characters' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: userStore.nextid++,
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    createdAt: new Date().toISOString(),
  };

  userStore.users.push(newUser);

  const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });

  res.status(201).json({
    success: true,
    data: { id: newUser.id, name: newUser.name, email: newUser.email },
    token,
  });
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, msg: 'Email and password are required' });
    }

    const user = userStore.users.find(u => u.email === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ success: false, msg: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, msg: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(200).json({
      success: true,
      data: { id: user.id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    console.error("Backend login crash:", error);
    return res.status(500).json({ success: false, msg: 'Internal server error' });
  }
};

export const getme = (req, res) => {
  res.status(200).json({ success: true, data: req.user });
};
