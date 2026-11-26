const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Terjadi kesalahan pada server';

  // MongoDB duplicate key
  if (err.code === 11000) {
    statusCode = 409;
    message = 'Data sudah terdaftar atau duplikat';
  }

  // MongoDB invalid ObjectId
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'ID atau format data tidak valid';
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map(error => error.message)
      .join(', ');
  }

  // Malformed JSON
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    message = 'Format JSON tidak valid';
  }

  // Pesan aman untuk server error
  if (statusCode >= 500) {
    statusCode = 500;
    message = 'Terjadi kesalahan pada server';
  }

  res.status(statusCode).json({
    success: false,
    status: statusCode >= 500 ? 'error' : 'fail',
    message
  });
};

module.exports = errorHandler;