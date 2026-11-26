const { body, param, query } = require('express-validator');

// VALIDASI CREATE TODO
exports.createTodoValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Judul Todo wajib diisi'),

  body('description')
    .optional()
    .isString().withMessage('Deskripsi harus berupa teks'),

  body('status')
    .optional()
    .isIn(['pending', 'in_progress', 'completed'])
    .withMessage('Status Todo tidak valid'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Prioritas Todo tidak valid'),

  body('dueDate')
    .optional({ values: 'falsy' })
    .isISO8601().withMessage('Format tanggal tidak valid'),

  body('category')
    .optional({ values: 'falsy' })
    .isMongoId().withMessage('ID kategori tidak valid')
];

// VALIDASI UPDATE TODO
exports.updateTodoValidator = [
  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('Judul Todo tidak boleh kosong'),

  body('description')
    .optional()
    .isString().withMessage('Deskripsi harus berupa teks'),

  body('status')
    .optional()
    .isIn(['pending', 'in_progress', 'completed'])
    .withMessage('Status Todo tidak valid'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Prioritas Todo tidak valid'),

  body('dueDate')
    .optional({ values: 'falsy' })
    .isISO8601().withMessage('Format tanggal tidak valid'),

  body('category')
    .optional({ values: 'falsy' })
    .isMongoId().withMessage('ID kategori tidak valid')
];


// VALIDASI ID TODO
exports.todoIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('ID Todo tidak valid')
];

// VALIDASI QUERY TODO
exports.getTodosValidator = [
  query('status')
    .optional()
    .isIn(['pending', 'in_progress', 'completed'])
    .withMessage('Status Todo tidak valid'),

  query('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Prioritas Todo tidak valid'),

  query('category')
    .optional()
    .isMongoId()
    .withMessage('ID kategori tidak valid'),

  query('sortBy')
    .optional()
    .isIn(['createdAt', 'updatedAt', 'title', 'dueDate', 'priority', 'status'])
    .withMessage('Kolom sorting tidak valid'),

  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Urutan sorting tidak valid'),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page minimal 1'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit harus antara 1 sampai 100'),

  query('search')
    .optional()
    .isString()
    .withMessage('Search harus berupa teks')
];