const jwt = require('jsonwebtoken');
const User = require('../model/User');
const AppError = require('../util/AppError');
const catchAsync = require('../util/catchAsync');

const protect = catchAsync(async (req, res, next) => {
  let token;

  // Mengambil token dari header Authorization
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Jika token tidak ada
  if (!token) {
    return next(new AppError('Anda belum login. Silakan login terlebih dahulu.', 401));
  }

  // Verifikasi token JWT
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Mengecek apakah user masih ada
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(new AppError('User tidak ditemukan.', 401));
  }

  // Menyimpan data user ke request
  req.user = currentUser;

  next();
});

module.exports = protect;