const mongoose = require('mongoose');

const overviewSchema = new mongoose.Schema(
  {
    user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product:    { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    message:    { type: String, required: true, trim: true },
    rating:     { type: Number, min: 1, max: 5 },
    isApproved: { type: Boolean, default: false },
    isDeleted:  { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

overviewSchema.pre('find',           function () { this.where({ isDeleted: false }); });
overviewSchema.pre('findOne',        function () { this.where({ isDeleted: false }); });
overviewSchema.pre('findOneAndUpdate', function () { this.where({ isDeleted: false }); });

module.exports = mongoose.model('Overview', overviewSchema);
