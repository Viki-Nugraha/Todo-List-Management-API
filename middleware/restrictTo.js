const AppError = require('../util/AppError');

const restrictTo = (...roles) => {
  return (req, res, next) => {

    if (!req.user) {
      return next(new AppError('Anda belum login.', 401));
    }

    console.log('Role user:', req.user.role);

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('Anda tidak memiliki izin untuk mengakses fitur ini.', 403)
      );
    }

    next();
  };
};

module.exports = restrictTo;