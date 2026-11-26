const { body, param, query } = require('express-validator');

// VALIDASI CREATE CATEGORY
exports.createCategoryValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Nama kategori wajib diisi'),

  body('description')
    .optional()
    .isString().withMessage('Deskripsi harus berupa teks')
];

// VALIDASI UPDATE CATEGORY
exports.updateCategoryValidator = [
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Nama kategori tidak boleh kosong'),

  body('description')
    .optional()
    .isString().withMessage('Deskripsi harus berupa teks')
];

// VALIDASI ID CATEGORY
exports.categoryIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('ID kategori tidak valid')
];

// VALIDASI QUERY CATEGORY
exports.getCategoriesValidator = [
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'updatedAt', 'name'])
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