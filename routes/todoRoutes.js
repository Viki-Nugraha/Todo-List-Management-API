const express = require('express');
const router = express.Router();

const protect = require('../middleware/protect');
const validate = require('../middleware/validate');

const {
  createTodoValidator,
  updateTodoValidator,
  todoIdValidator,
  getTodosValidator
} = require('../validator/todoValidator');

const {
  createTodo,
  getTodos,
  getTodo,
  updateTodo,
  deleteTodo
} = require('../controller/todoController');

router.use(protect);

/**
 * @swagger
 * /api/todos:
 *   post:
 *     summary: Membuat Todo baru
 *     tags: [Todo]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Belajar Node.js
 *               description:
 *                 type: string
 *                 example: Mempelajari dokumentasi Swagger
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, completed]
 *                 example: pending
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 example: high
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 example: '2026-12-01T10:00:00.000Z'
 *               category:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *     responses:
 *       201:
 *         description: Todo berhasil dibuat
 *       400:
 *         description: Data Todo tidak valid
 *       401:
 *         description: Belum login atau token tidak valid
 */

// CREATE
router.post('/', createTodoValidator, validate, createTodo);

/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: Mendapatkan semua Todo milik pengguna
 *     tags: [Todo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, in_progress, completed]
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: ID kategori
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt, title, dueDate, priority, status]
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
 *         description: Daftar Todo berhasil ditampilkan
 *       400:
 *         description: Parameter query tidak valid
 *       401:
 *         description: Belum login atau token tidak valid
 */

// READ ALL
router.get('/', getTodosValidator, validate, getTodos);

/**
 * @swagger
 * /api/todos/{id}:
 *   get:
 *     summary: Mendapatkan detail Todo berdasarkan ID
 *     tags: [Todo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID Todo
 *     responses:
 *       200:
 *         description: Detail Todo berhasil ditampilkan
 *       400:
 *         description: ID Todo tidak valid
 *       401:
 *         description: Belum login atau token tidak valid
 *       404:
 *         description: Todo tidak ditemukan
 */

// READ ONE
router.get('/:id', todoIdValidator, validate, getTodo);

/**
 * @swagger
 * /api/todos/{id}:
 *   patch:
 *     summary: Memperbarui Todo berdasarkan ID
 *     tags: [Todo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID Todo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Belajar Express.js
 *               description:
 *                 type: string
 *                 example: Memperbarui deskripsi Todo
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, completed]
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Todo berhasil diperbarui
 *       400:
 *         description: Data atau ID Todo tidak valid
 *       401:
 *         description: Belum login atau token tidak valid
 *       404:
 *         description: Todo tidak ditemukan
 */

// UPDATE
router.patch('/:id', todoIdValidator, updateTodoValidator, validate, updateTodo);

/**
 * @swagger
 * /api/todos/{id}:
 *   delete:
 *     summary: Menghapus Todo berdasarkan ID
 *     tags: [Todo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID Todo
 *     responses:
 *       200:
 *         description: Todo berhasil dihapus
 *       400:
 *         description: ID Todo tidak valid
 *       401:
 *         description: Belum login atau token tidak valid
 *       404:
 *         description: Todo tidak ditemukan
 */

// DELETE
router.delete('/:id', todoIdValidator, validate, deleteTodo);

module.exports = router;