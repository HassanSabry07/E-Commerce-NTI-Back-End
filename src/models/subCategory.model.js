const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubCategory", subCategorySchema);
