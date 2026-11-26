
const ActivityLog = require('../model/ActivityLog');
const AppError = require('../util/AppError');
const catchAsync = require('../util/catchAsync');

// GET ALL ACTIVITY LOG
exports.getActivityLogs = catchAsync(async (req, res, next) => {
  const logs = await ActivityLog.find({
    user: req.user._id
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    results: logs.length,
    data: { logs }
  });
});
