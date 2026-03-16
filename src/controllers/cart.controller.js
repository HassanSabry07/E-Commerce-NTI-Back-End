const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

const populateCart = (query) => query.populate('items.product', 'title price image stock slug category');

exports.getCart = async (req, res) => {
  try {
    const cart = await populateCart(Cart.findOne({ user: req.user._id }));
    res.status(200).json({ message: 'Your Cart', data: cart });
  } catch (err) {
    console.error(`Error In getCart(): ${err.message}`);
    res.status(500).json({ message: 'Getting Cart failed' });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user._id;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.stock < quantity) return res.status(400).json({ message: 'Not enough stock' });

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [{ product: productId, quantity, priceAtAdding: product.price }] });
    } else {
      const item = cart.items.find(i => i.product.toString() === productId);
      if (item) { item.quantity += quantity; item.priceAtAdding = product.price; }
      else cart.items.push({ product: productId, quantity, priceAtAdding: product.price });
    }
    await cart.save();
    const populated = await populateCart(Cart.findById(cart._id));
    res.status(200).json({ message: 'Added to cart', data: populated });
  } catch (err) {
    console.error(`Error In addToCart(): ${err.message}`);
    res.status(500).json({ message: 'Adding to Cart failed' });
  }
};

exports.updateQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    const productId = req.params.productId;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    const item = cart.items.find(i => i.product.toString() === productId);
    if (!item) return res.status(404).json({ message: 'Item not in cart' });
    item.quantity = quantity;
    await cart.save();
    const populated = await populateCart(Cart.findById(cart._id));
    res.status(200).json({ message: 'Quantity updated', data: populated });
  } catch (err) {
    console.error(`Error In updateQuantity(): ${err.message}`);
    res.status(500).json({ message: 'Updating Quantity failed' });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.items = cart.items.filter(i => i.product.toString() !== req.params.productId);
    await cart.save();
    const populated = await populateCart(Cart.findById(cart._id));
    res.status(200).json({ message: 'Removed from cart', data: populated });
  } catch (err) {
    console.error(`Error In removeFromCart(): ${err.message}`);
    res.status(500).json({ message: 'Removing from Cart failed' });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.items = [];
    await cart.save();
    res.status(200).json({ message: 'Cart cleared', data: cart });
  } catch (err) {
    console.error(`Error In clearCart(): ${err.message}`);
    res.status(500).json({ message: 'Clearing Cart failed' });
  }
};
