const Wishlist = require('../models/wishlist.model');
const Product = require('../models/product.model');
const Cart = require('../models/cart.model');

exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id })
      .populate('items.product', 'title price image stock slug category');
    res.status(200).json({ message: 'Your Wishlist', data: wishlist });
  } catch (err) {
    console.error(`Error In getWishlist(): ${err.message}`);
    res.status(500).json({ message: 'Getting Wishlist failed' });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, items: [{ product: productId, priceAtAdding: product.price }] });
    } else {
      const exists = wishlist.items.some(i => i.product.toString() === productId);
      if (exists) return res.status(400).json({ message: 'Product already in wishlist' });
      wishlist.items.push({ product: productId, priceAtAdding: product.price });
    }
    await wishlist.save();
    const populated = await Wishlist.findById(wishlist._id).populate('items.product', 'title price image stock slug category');
    res.status(200).json({ message: 'Added to wishlist', data: populated });
  } catch (err) {
    console.error(`Error In addToWishlist(): ${err.message}`);
    res.status(500).json({ message: 'Adding to Wishlist failed' });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const productId = req.params.id;
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });
    wishlist.items = wishlist.items.filter(i => i.product.toString() !== productId);
    await wishlist.save();
    const populated = await Wishlist.findById(wishlist._id).populate('items.product', 'title price image stock slug category');
    res.status(200).json({ message: 'Removed from wishlist', data: populated });
  } catch (err) {
    console.error(`Error In removeFromWishlist(): ${err.message}`);
    res.status(500).json({ message: 'Removing from Wishlist failed' });
  }
};

exports.clearWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });
    wishlist.items = [];
    await wishlist.save();
    res.status(200).json({ message: 'Wishlist cleared', data: wishlist });
  } catch (err) {
    console.error(`Error In clearWishlist(): ${err.message}`);
    res.status(500).json({ message: 'Clearing Wishlist failed' });
  }
};

exports.moveToCart = async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user._id;
    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });
    const wishlistItem = wishlist.items.find(i => i.product.toString() === productId);
    if (!wishlistItem) return res.status(404).json({ message: 'Product not in wishlist' });
    const product = await Product.findById(productId);
    if (!product || product.stock < 1) return res.status(400).json({ message: 'Product out of stock' });

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [{ product: productId, quantity: 1, priceAtAdding: product.price }] });
    } else {
      const cartItem = cart.items.find(i => i.product.toString() === productId);
      if (cartItem) { cartItem.quantity += 1; cartItem.priceAtAdding = product.price; }
      else cart.items.push({ product: productId, quantity: 1, priceAtAdding: product.price });
    }
    await cart.save();
    wishlist.items = wishlist.items.filter(i => i.product.toString() !== productId);
    await wishlist.save();
    res.status(200).json({ message: 'Moved to cart' });
  } catch (err) {
    console.error(`Error In moveToCart(): ${err.message}`);
    res.status(500).json({ message: 'Moving to Cart failed' });
  }
};
