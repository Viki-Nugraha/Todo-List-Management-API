
const express = require('express');
const router = express.Router();

const apiKeyAuth = require('../middleware/apiKeyAuth');
const { getSummary } = require('../controller/statsController');

/**
 * @swagger
 * /api/stats/summary:
 *   get:
 *     summary: Mendapatkan ringkasan statistik Todo
 *     tags: [Stats]
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         schema:
 *           type: string
 *         description: API Key untuk mengakses statistik
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan ringkasan statistik
 *       401:
 *         description: API Key tidak valid atau tidak tersedia
 */
router.get('/summary', apiKeyAuth, getSummary);

module.exports = router;
