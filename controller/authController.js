const User = require('../model/User');
const AppError = require('../util/AppError');
const catchAsync = require('../util/catchAsync');
const jwt = require('jsonwebtoken');

// Membuat JWT Token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// REGISTER
exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Cek apakah email sudah digunakan
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return next(new AppError('Email sudah terdaftar', 400));
  }

  // Membuat user baru
  const user = await User.create({
    name,
    email,
    password
  });

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: 'Register berhasil',
    token,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    }
  });
});

// LOGIN
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Cari user berdasarkan email
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Email atau password salah', 401));
  }

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    message: 'Login berhasil',
    token,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    }
  });
});