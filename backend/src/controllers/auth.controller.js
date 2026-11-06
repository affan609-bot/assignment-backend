import Admin from '../models/Admin.js';
import { signToken } from '../utils/jwt.js';
import ApiError from '../utils/ApiError.js';

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw ApiError.badRequest('name, email and password are required.');
  }

  const exists = await Admin.findOne({ email });
  if (exists) {
    throw ApiError.conflict('Email already registered.');
  }

  const admin = await Admin.create({ name, email, password });
  const token = signToken({ id: admin._id, role: admin.role });

  res.status(201).json({
    success: true,
    message: 'Admin created successfully.',
    token,
    admin,
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw ApiError.badRequest('email and password are required.');
  }

  // password has select:false, so explicitly select it
  const admin = await Admin.findOne({ email }).select('+password');
  if (!admin) {
    throw ApiError.unauthorized('Invalid email or password.');
  }

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    throw ApiError.unauthorized('Invalid email or password.');
  }

  const token = signToken({ id: admin._id, role: admin.role });

  res.json({
    success: true,
    message: 'Login successful.',
    token,
    admin: admin.toJSON(),
  });
};

export const logout = (req, res) => {
  // Stateless JWT: client removes token. Cookie clear if used.
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully.' });
};

export const me = (req, res) => {
  res.json({ success: true, data: req.admin });
};
