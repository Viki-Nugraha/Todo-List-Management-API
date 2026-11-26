
const express = require('express');
const router = express.Router();

const protect = require('../middleware/protect');
const restrictTo = require('../middleware/restrictTo');
const validate = require('../middleware/validate');

const {
  registerValidator,
  loginValidator
} = require('../validator/authValidator');

const {
  register,
  login
} = require('../controller/authController');


/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrasi pengguna baru
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Example
 *               email:
 *                 type: string
 *                 example: example@example.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: rahasia123
 *     responses:
 *       201:
 *         description: Registrasi berhasil
 *       400:
 *         description: Data tidak valid atau email sudah digunakan
 */

// REGISTER
router.post(
  '/register',
  registerValidator,
  validate,
  register
);


/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login pengguna
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: example@example.com
 *               password:
 *                 type: string
 *                 example: rahasia123
 *     responses:
 *       200:
 *         description: Login berhasil
 *       401:
 *         description: Email atau password salah
 *       400:
 *         description: Data tidak valid
 */

// LOGIN
router.post(
  '/login',
  loginValidator,
  validate,
  login
);


/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Melihat profil pengguna yang sedang login
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Autentikasi berhasil
 *       401:
 *         description: Belum login atau token tidak valid
 */

// GET CURRENT USER
router.get('/me', protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Autentikasi berhasil',
    data: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email
    }
  });
});


/**
 * @swagger
 * /api/auth/admin-only:
 *   get:
 *     summary: Endpoint khusus admin
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Selamat datang, Admin!
 *       401:
 *         description: Belum login atau token tidak valid
 *       403:
 *         description: Pengguna tidak memiliki izin admin
 */

// ADMIN ONLY
router.get('/admin-only', protect, restrictTo('admin'), (req, res) => {
  res.json({
    success: true,
    message: 'Selamat datang, Admin!'
  });
});

module.exports = router;
