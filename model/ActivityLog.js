
const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    action: {
      type: String,
      enum: ['create', 'update', 'delete'],
      required: true
    },
    resource: {
      type: String,
      enum: ['Todo', 'Category', 'User'],
      required: true
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    details: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

module.exports = mongoose.model('ActivityLog', activityLogSchema);
