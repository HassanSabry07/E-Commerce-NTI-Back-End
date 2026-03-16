const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product:      { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity:     { type: Number, default: 1, min: 1 },
  priceAtAdding:{ type: Number, required: true },
  isChanged:    { type: Boolean, default: false }
}, { _id: false });

const cartSchema = new mongoose.Schema({
  user:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items:         [cartItemSchema],
  totalQuantity: { type: Number, default: 0 },
  totalPrice:    { type: Number, default: 0 }
}, { timestamps: true });

cartSchema.pre('save', function () {
  if (this.items && this.items.length > 0) {
    this.totalQuantity = this.items.reduce((sum, item) => sum + item.quantity, 0);
    this.totalPrice = Math.round(
      this.items.reduce((sum, item) => sum + item.quantity * item.priceAtAdding, 0) * 100
    ) / 100;
  } else {
    this.totalPrice = 0;
    this.totalQuantity = 0;
  }
});

module.exports = mongoose.model('Cart', cartSchema);