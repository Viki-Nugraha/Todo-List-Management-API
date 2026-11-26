const AppError = require('../util/AppError');

const apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey || apiKey !== process.env.API_KEY) {
    return next(new AppError('API Key tidak valid atau tidak tersedia', 401));
  }

  next();
};

module.exports = apiKeyAuth;