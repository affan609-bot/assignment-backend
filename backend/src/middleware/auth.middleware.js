import { verifyToken } from '../utils/jwt.js';
import Admin from '../models/Admin.js';
import ApiError from '../utils/ApiError.js';

/**
 * protect: JWT verify karta hai, req.admin set karta hai.
 * Token missing/invalid → 401 "Please login first."
 */
export const protect = async (req, res, next) => {
  try {
    let token = null;

    // 1) Authorization: Bearer <token>
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    // 2) Cookie fallback
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      throw ApiError.unauthorized('Please login first.');
    }

    const decoded = verifyToken(token);
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      throw ApiError.unauthorized('Please login first.');
    }

    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      next(ApiError.unauthorized('Please login first.'));
    } else {
      next(error);
    }
  }
};

/**
 * adminOnly: role check (already admin by model, but kept for clarity).
 */
export const adminOnly = (req, res, next) => {
  if (!req.admin || req.admin.role !== 'admin') {
    return next(ApiError.forbidden('Admin access required.'));
  }
  next();
};
