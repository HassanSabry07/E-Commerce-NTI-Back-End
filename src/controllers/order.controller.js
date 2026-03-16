const Order = require('../models/order.model');
const Product = require('../models/product.model');
const Cart = require('../models/cart.model');
const Notification = require('../models/notification.model');

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').populate('products.product', 'title image price');
    res.status(200).json({ message: 'Orders List', data: orders });
  } catch (err) { console.error(`Error In getOrders(): ${err.message}`); res.status(500).json({ message: 'Getting Orders failed' }); }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('products.product', 'title image price');
    res.status(200).json({ message: 'My Orders', data: orders });
  } catch (err) { console.error(`Error In getMyOrders(): ${err.message}`); res.status(500).json({ message: 'Getting Orders failed' }); }
};

exports.createOrder = async (req, res) => {
  try {
    const { shippingAddress, phone } = req.body;
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'Cart is empty' });
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) return res.status(400).json({ message: `Not enough stock for ${item.product.title}` });
    }
    for (const item of cart.items) {
      const updated = await Product.findByIdAndUpdate(
        item.product._id,
        { $inc: { stock: -item.quantity } },
        { new: true }
      );
      // ✅ notify admin if stock = 1
      if (updated && updated.stock === 1) {
        await Notification.create({
          type: 'low_stock',
          product: updated._id,
          message: `⚠️ Low stock! "${updated.title}" has only 1 item left.`
        });
      }
      if (updated && updated.stock === 0) {
        await Notification.create({
          type: 'out_of_stock',
          product: updated._id,
          message: `🚨 Out of stock! "${updated.title}" is now out of stock.`
        });
      }
    }
    const order = await Order.create({
      user: userId,
      products: cart.items.map(item => ({ product: item.product._id, quantity: item.quantity, priceAtOrdering: item.priceAtAdding })),
      totalPrice: cart.totalPrice,
      shippingAddress,
      phone,
    });
    cart.items = [];
    await cart.save();
    res.status(201).json({ message: 'Order created successfully', data: order });
  } catch (err) { console.error(`Error In createOrder(): ${err.message}`); res.status(500).json({ message: 'Creating Order failed' }); }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true })
      .populate('user', 'name email').populate('products.product', 'title image price');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json({ message: 'Status updated', data: order });
  } catch (err) { console.error(`Error In updateStatus(): ${err.message}`); res.status(500).json({ message: 'Updating Status failed' }); }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.status !== 'pending') return res.status(400).json({ message: 'Cannot cancel this order' });
    order.status = 'cancelled';
    await order.save();
    for (const item of order.products) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
    }
    res.status(200).json({ message: 'Order cancelled', data: order });
  } catch (err) { console.error(`Error In cancelOrder(): ${err.message}`); res.status(500).json({ message: 'Cancelling Order failed' }); }
};

exports.deleteMyOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (!['cancelled','delivered','rejected'].includes(order.status)) return res.status(400).json({ message: 'Cannot remove this order' });
    await Order.findByIdAndUpdate(req.params.id, { isDeleted: true });
    res.status(200).json({ message: 'Order removed' });
  } catch (err) { console.error(`Error In deleteMyOrder(): ${err.message}`); res.status(500).json({ message: 'Deleting Order failed' }); }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json({ message: 'Order deleted', data: order });
  } catch (err) { console.error(`Error In deleteOrder(): ${err.message}`); res.status(500).json({ message: 'Deleting Order failed' }); }
};
