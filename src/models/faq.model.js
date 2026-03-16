const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema(
  {
    question:    { type: String, required: true, trim: true },
    answer:      { type: String, trim: true, default: '' },
    askedBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isPublished: { type: Boolean, default: false },
    isDeleted:   { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FAQ', faqSchema);
