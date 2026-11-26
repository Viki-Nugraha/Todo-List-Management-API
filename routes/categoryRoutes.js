const express = require('express');
const router = express.Router();

const protect = require('../middleware/protect');
const validate = require('../middleware/validate');

const {
  createCategoryValidator,
  updateCategoryValidator,
  categoryIdValidator,
  getCategoriesValidator
} = require('../validator/categoryValidator');

const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory
} = require('../controller/categoryController');

// Semua route Category wajib login
router.use(protect);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Membuat kategori baru
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Pekerjaan
 *               description:
 *                 type: string
 *                 example: Kategori untuk tugas pekerjaan
 *     responses:
 *       201:
 *         description: Kategori berhasil dibuat
 *       400:
 *         description: Data kategori tidak valid
 *       401:
 *         description: Belum login atau token tidak valid
 */

// CREATE
router.post('/', createCategoryValidator, validate, createCategory);

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Mendapatkan semua kategori milik pengguna
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt, name]
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Daftar kategori berhasil ditampilkan
 *       400:
 *         description: Parameter query tidak valid
 *       401:
 *         description: Belum login atau token tidak valid
 */

// READ ALL
router.get('/', getCategoriesValidator, validate, getCategories);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Mendapatkan detail kategori berdasarkan ID
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID kategori
 *     responses:
 *       200:
 *         description: Detail kategori berhasil ditampilkan
 *       400:
 *         description: ID kategori tidak valid
 *       401:
 *         description: Belum login atau token tidak valid
 *       404:
 *         description: Kategori tidak ditemukan
 */

// READ ONE
router.get('/:id', categoryIdValidator, validate, getCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   patch:
 *     summary: Memperbarui kategori berdasarkan ID
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID kategori
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Tugas Sekolah
 *               description:
 *                 type: string
 *                 example: Kategori untuk tugas sekolah
 *     responses:
 *       200:
 *         description: Kategori berhasil diperbarui
 *       400:
 *         description: Data atau ID kategori tidak valid
 *       401:
 *         description: Belum login atau token tidak valid
 *       404:
 *         description: Kategori tidak ditemukan
 */

// UPDATE
router.patch('/:id', categoryIdValidator, updateCategoryValidator, validate, updateCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Menghapus kategori berdasarkan ID
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID kategori
 *     responses:
 *       200:
 *         description: Kategori berhasil dihapus
 *       400:
 *         description: ID kategori tidak valid
 *       401:
 *         description: Belum login atau token tidak valid
 *       404:
 *         description: Kategori tidak ditemukan
 */

// DELETE
router.delete('/:id', categoryIdValidator, validate, deleteCategory);

module.exports = router;