
const Todo = require('../model/Todo');
require('../model/Category');
const AppError = require('../util/AppError');
const catchAsync = require('../util/catchAsync');
const ActivityLog = require('../model/ActivityLog');

// CREATE TODO
exports.createTodo = catchAsync(async (req, res, next) => {
  const todo = await Todo.create({
    ...req.body,
    user: req.user._id
  });

  await ActivityLog.create({
    user: req.user._id,
    action: 'create',
    resource: 'Todo',
    resourceId: todo._id,
    details: `Membuat Todo: ${todo.title}`
  });

  res.status(201).json({
    success: true,
    message: 'Todo berhasil dibuat',
    data: { todo }
  });
});


// READ ALL TODO
exports.getTodos = catchAsync(async (req, res, next) => {
  // FILTERING
  const filter = {
    user: req.user._id
  };

  if (req.query.status) {
    filter.status = req.query.status;
  }

  if (req.query.priority) {
    filter.priority = req.query.priority;
  }

  if (req.query.category) {
    filter.category = req.query.category;
  }

  // SEARCH
  if (req.query.search) {
    filter.$or = [
      { title: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  // SORTING
  const sortBy = ['createdAt', 'updatedAt', 'title', 'dueDate', 'priority', 'status']
    .includes(req.query.sortBy)
      ? req.query.sortBy
      : 'createdAt';

  const order = req.query.order === 'asc' ? 1 : -1;

  // PAGINATION
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
  const skip = (page - 1) * limit;

  // QUERY DATABASE
  const total = await Todo.countDocuments(filter);

  const todos = await Todo.find(filter)
    .populate('category')
    .sort({ [sortBy]: order })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    results: todos.length,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    },
    data: { todos }
  });
});


// READ ONE TODO
exports.getTodo = catchAsync(async (req, res, next) => {
  const todo = await Todo.findOne({
    _id: req.params.id,
    user: req.user._id
  }).populate('category');

  if (!todo) {
    return next(new AppError('Todo tidak ditemukan.', 404));
  }

  res.status(200).json({
    success: true,
    data: { todo }
  });
});

// UPDATE TODO
exports.updateTodo = catchAsync(async (req, res, next) => {
  const allowedFields = [
    'title',
    'description',
    'status',
    'priority',
    'dueDate',
    'category'
  ];

  const updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const todo = await Todo.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.user._id
    },
    updates,
    {
      returnDocument: 'after',
      runValidators: true
    }
  ).populate('category');

  if (!todo) {
    return next(new AppError('Todo tidak ditemukan.', 404));
  }

  await ActivityLog.create({
  user: req.user._id,
  action: 'update',
  resource: 'Todo',
  resourceId: todo._id,
  details: `Memperbarui Todo: ${todo.title}`
});

  res.status(200).json({
    success: true,
    message: 'Todo berhasil diperbarui',
    data: { todo }
  });
});

// DELETE TODO
exports.deleteTodo = catchAsync(async (req, res, next) => {
  const todo = await Todo.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id
  });

  if (!todo) {
    return next(new AppError('Todo tidak ditemukan.', 404));
  }

  await ActivityLog.create({
  user: req.user._id,
  action: 'delete',
  resource: 'Todo',
  resourceId: todo._id,
  details: `Menghapus Todo: ${todo.title}`
});

  res.status(200).json({
    success: true,
    message: 'Todo berhasil dihapus'
  });
});
