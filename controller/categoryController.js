
const Category = require('../model/Category');
const AppError = require('../util/AppError');
const catchAsync = require('../util/catchAsync');

// CREATE CATEGORY
exports.createCategory = catchAsync(async (req, res, next) => {
  const category = await Category.create({
    name: req.body.name,
    description: req.body.description,
    user: req.user._id
  });

  res.status(201).json({
    success: true,
    message: 'Category berhasil dibuat',
    data: { category }
  });
});


// READ ALL CATEGORY
exports.getCategories = catchAsync(async (req, res, next) => {
  // FILTERING
  const filter = {
    user: req.user._id
  };

  // SEARCH
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  // SORTING
  const sortBy = ['createdAt', 'updatedAt', 'name']
    .includes(req.query.sortBy)
      ? req.query.sortBy
      : 'createdAt';

  const order = req.query.order === 'asc' ? 1 : -1;

  // PAGINATION
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
  const skip = (page - 1) * limit;

  // QUERY DATABASE
  const total = await Category.countDocuments(filter);

  const categories = await Category.find(filter)
    .sort({ [sortBy]: order })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    results: categories.length,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    },
    data: { categories }
  });
});


// READ ONE CATEGORY
exports.getCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!category) {
    return next(new AppError('Category tidak ditemukan.', 404));
  }

  res.status(200).json({
    success: true,
    data: { category }
  });
});

// UPDATE CATEGORY
exports.updateCategory = catchAsync(async (req, res, next) => {
  const updates = {};

  ['name', 'description'].forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const category = await Category.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.user._id
    },
    updates,
    {
      returnDocument: 'after',
      runValidators: true
    }
  );

  if (!category) {
    return next(new AppError('Category tidak ditemukan.', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Category berhasil diperbarui',
    data: { category }
  });
});

// DELETE CATEGORY
exports.deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id
  });

  if (!category) {
    return next(new AppError('Category tidak ditemukan.', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Category berhasil dihapus'
  });
});
