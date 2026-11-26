const Todo = require('../model/Todo');
const Category = require('../model/Category');
const catchAsync = require('../util/catchAsync');

// GET STATISTICS SUMMARY
exports.getSummary = catchAsync(async (req, res, next) => {
  const [
    totalTodos,
    pendingTodos,
    inProgressTodos,
    completedTodos,
    totalCategories
  ] = await Promise.all([
    Todo.countDocuments(),
    Todo.countDocuments({ status: 'pending' }),
    Todo.countDocuments({ status: 'in_progress' }),
    Todo.countDocuments({ status: 'completed' }),
    Category.countDocuments()
  ]);

  res.status(200).json({
    success: true,
    message: 'Statistik berhasil diambil',
    data: {
      totalTodos,
      pendingTodos,
      inProgressTodos,
      completedTodos,
      totalCategories
    }
  });
});