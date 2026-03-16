const mongoose = require('mongoose');
const SubCategory = require('./subCategory.model');

const categorySchema = new mongoose.Schema({
  name:      { type: String, required: true, unique: true },
  isDeleted: { type: Boolean, default: false, index: true }
}, { timestamps: true });

categorySchema.pre('find',           function () { this.where({ isDeleted: false }); });
categorySchema.pre('findOne',        function () { this.where({ isDeleted: false }); });
categorySchema.pre('countDocuments', function () { this.where({ isDeleted: false }); });

categorySchema.pre('findOneAndUpdate', async function () {
  this.where({ isDeleted: false });

  const update = this.getUpdate();
  const isDeleted = update?.isDeleted ?? update?.$set?.isDeleted;

  if (isDeleted === true) {
    const categoryId = this.getQuery()._id;
    await SubCategory.updateMany(
      { parentCategory: categoryId },
      { $set: { isDeleted: true } }
    );
  }
});

module.exports = mongoose.model('Category', categorySchema);