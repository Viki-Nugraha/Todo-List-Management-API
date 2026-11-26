const express = require('express');
const router = express.Router();

const protect = require('../middleware/protect');
const { getActivityLogs } = require('../controller/activityLogController');

router.use(protect);

/**
 * @swagger
 * /api/activity-logs:
 *   get:
 *     summary: Mendapatkan riwayat aktivitas pengguna
 *     tags: [Activity Log]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Riwayat aktivitas berhasil ditampilkan
 *       401:
 *         description: Belum login atau token tidak valid
 */

router.get('/', getActivityLogs);

module.exports = router;