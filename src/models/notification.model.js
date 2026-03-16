const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    type:      { type: String, enum: ['low_stock', 'out_of_stock'], required: true },
    product:   { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    message:   { type: String, required: true },
    isRead:    { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
