
const express = require('express');

const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const activityLogRoutes = require('./routes/activityLogRoutes');
const statsRoutes = require('./routes/statsRoutes');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const errorHandler = require('./middleware/errorHandler');
const AppError = require('./util/AppError');

const app = express();

app.use(express.json());

// KONEKSI MONGODB
let dbConnectionPromise;

const ensureDB = async (req, res, next) => {
  try {
    if (!dbConnectionPromise || !require('mongoose').connection.readyState) {
      dbConnectionPromise = connectDB().catch((error) => {
        dbConnectionPromise = null;
        throw error;
      });
    }

    await dbConnectionPromise;
    next();
  } catch (error) {
    next(error);
  }
};

// SWAGGER DOCUMENTATION
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API ROUTES
app.use('/api', ensureDB);

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/activity-logs', activityLogRoutes);
app.use('/api/stats', statsRoutes);

// HOME ROUTE
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API Todo List Management berhasil berjalan!',
    version: '1.0.0'
  });
});

// UNKNOWN ROUTES
app.use((req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} tidak ditemukan`, 404));
});

// GLOBAL ERROR HANDLER
app.use(errorHandler);

module.exports = app;
