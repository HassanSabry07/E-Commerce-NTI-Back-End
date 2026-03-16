const mongoose = require('mongoose');

const wishlistItemSchema = new mongoose.Schema(
  {
    product:       { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    priceAtAdding: { type: Number, required: true },
    addedAt:       { type: Date, default: Date.now },
  },
  { _id: false }
);

const wishlistSchema = new mongoose.Schema(
  {
    user:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [wishlistItemSchema],
  },
  { timestamps: true }
);

wishlistSchema.pre('save', function () {
  const ids = this.items.map((i) => i.product.toString());
  const hasDuplicates = ids.length !== new Set(ids).size;
  if (hasDuplicates) throw new Error('Product already in wishlist');
});

module.exports = mongoose.model('Wishlist', wishlistSchema);