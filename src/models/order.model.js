const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: { type: Number, required: true, min: 1 },
    priceAtOrdering: { type: Number, required: true },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [orderItemSchema],
    totalPrice: { type: Number, required: true },
    shippingAddress: {
      type: {
        street: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        governorate: { type: String, required: true, trim: true },
      },
      required: true,
    },
    phone: {
      type: String,
      required: true,
      match: [/^01[0125][0-9]{8}$/, "Invalid Egyptian phone number"],
    },
    status: {
      type: String,
      enum: [
        "pending",
        "preparing",
        "shipped",
        "delivered",
        "cancelled",
        "rejected",
      ],
      default: "pending",
    },
    orderedAt: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

orderSchema.pre("find", function () {
  this.where({ isDeleted: false });
});
orderSchema.pre("findOne", function () {
  this.where({ isDeleted: false });
});
orderSchema.pre("countDocuments", function () {
  this.where({ isDeleted: false });
});
orderSchema.pre("findOneAndUpdate", function () {
  this.where({ isDeleted: false });
});

module.exports = mongoose.model("Order", orderSchema);
