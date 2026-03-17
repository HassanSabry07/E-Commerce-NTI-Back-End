const Order = require("../models/order.model");
const Product = require("../models/product.model");
const Cart = require("../models/cart.model");
const Notification = require("../models/notification.model");

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("products.product", "title image price");
    res.status(200).json({ message: "Orders List", data: orders });
  } catch (err) {
    console.error(`Error In getOrders(): ${err.message}`);
    res.status(500).json({ message: "Getting Orders failed" });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate(
      "products.product",
      "title image price",
    );
    res.status(200).json({ message: "My Orders", data: orders });
  } catch (err) {
    console.error(`Error In getMyOrders(): ${err.message}`);
    res.status(500).json({ message: "Getting Orders failed" });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { shippingAddress, phone } = req.body;
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: "Cart is empty" });
    for (const item of cart.items) {
      if (item.product.stock < item.quantity)
        return res
          .status(400)
          .json({ message: `Not enough stock for ${item.product.title}` });
    }
    for (const item of cart.items) {
      const updated = await Product.findByIdAndUpdate(
        item.product._id,
        { $inc: { stock: -item.quantity } },
        { new: true },
      );
      if (updated && updated.stock === 1)
        await Notification.create({
          type: "low_stock",
          product: updated._id,
          message: `⚠️ Low stock! "${updated.title}" has only 1 item left.`,
        });
      if (updated && updated.stock === 0)
        await Notification.create({
          type: "out_of_stock",
          product: updated._id,
          message: `🚨 Out of stock! "${updated.title}" is now out of stock.`,
        });
    }
    const order = await Order.create({
      user: userId,
      products: cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        priceAtOrdering: item.priceAtAdding,
      })),
      totalPrice: cart.totalPrice,
      shippingAddress,
      phone,
    });
    cart.items = [];
    await cart.save();
    res
      .status(201)
      .json({ message: "Order created successfully", data: order });
  } catch (err) {
    console.error(`Error In createOrder(): ${err.message}`);
    res.status(500).json({ message: "Creating Order failed" });
  }
};

exports.updateMyOrder = async (req, res) => {
  try {
    const { shippingAddress, phone, products } = req.body;
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (!["pending", "preparing"].includes(order.status))
      return res
        .status(400)
        .json({ message: "Cannot edit this order after it has been shipped" });

    if (products && Array.isArray(products)) {
      for (const newItem of products) {
        const product = await Product.findById(newItem.product);
        if (!product)
          return res
            .status(404)
            .json({ message: `Product not found: ${newItem.product}` });
        if (newItem.quantity < 1)
          return res
            .status(400)
            .json({ message: `Quantity must be at least 1` });
        const existing = order.products.find(
          (p) => p.product.toString() === newItem.product.toString(),
        );
        const currentQty = existing ? existing.quantity : 0;
        const diff = newItem.quantity - currentQty;
        if (diff > 0 && product.stock < diff)
          return res
            .status(400)
            .json({
              message: `Not enough stock for ${product.title} (available: ${product.stock})`,
            });
      }
      for (const oldItem of order.products)
        await Product.findByIdAndUpdate(oldItem.product, {
          $inc: { stock: oldItem.quantity },
        });

      const updatedProducts = [];
      for (const newItem of products) {
        const product = await Product.findByIdAndUpdate(
          newItem.product,
          { $inc: { stock: -newItem.quantity } },
          { new: true },
        );
        if (product && product.stock === 1)
          await Notification.create({
            type: "low_stock",
            product: product._id,
            message: `⚠️ Low stock! "${product.title}" has only 1 item left.`,
          });
        if (product && product.stock === 0)
          await Notification.create({
            type: "out_of_stock",
            product: product._id,
            message: `🚨 Out of stock! "${product.title}" is now out of stock.`,
          });
        const existingItem = order.products.find(
          (p) => p.product.toString() === newItem.product.toString(),
        );
        const priceAtOrdering = existingItem
          ? existingItem.priceAtOrdering
          : product.price;
        updatedProducts.push({
          product: newItem.product,
          quantity: newItem.quantity,
          priceAtOrdering,
        });
      }
      order.products = updatedProducts;
      order.totalPrice =
        Math.round(
          updatedProducts.reduce(
            (sum, item) => sum + item.quantity * item.priceAtOrdering,
            0,
          ) * 100,
        ) / 100;
    }

    if (shippingAddress) order.shippingAddress = shippingAddress;
    if (phone) order.phone = phone;
    await order.save();

    const updated = await Order.findById(order._id).populate(
      "products.product",
      "title image price",
    );
    res
      .status(200)
      .json({ message: "Order updated successfully", data: updated });
  } catch (err) {
    console.error(`Error In updateMyOrder(): ${err.message}`);
    res.status(500).json({ message: "Updating Order failed" });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // الأدمن لو كنسل → cancelled_by_admin
    const resolvedStatus =
      status === "cancelled" ? "cancelled_by_admin" : status;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: resolvedStatus },
      { new: true },
    )
      .populate("user", "name email")
      .populate("products.product", "title image price");
    if (!order) return res.status(404).json({ message: "Order not found" });

    // لو الأدمن كنسل → رجّع الـ stock
    if (resolvedStatus === "cancelled_by_admin") {
      for (const item of order.products)
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
        });
    }

    res.status(200).json({ message: "Status updated", data: order });
  } catch (err) {
    console.error(`Error In updateStatus(): ${err.message}`);
    res.status(500).json({ message: "Updating Status failed" });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.status !== "pending")
      return res.status(400).json({ message: "Cannot cancel this order" });

    // اليوزر كنسل → cancelled_by_user
    order.status = "cancelled_by_user";
    await order.save();
    for (const item of order.products)
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });

    res.status(200).json({ message: "Order cancelled", data: order });
  } catch (err) {
    console.error(`Error In cancelOrder(): ${err.message}`);
    res.status(500).json({ message: "Cancelling Order failed" });
  }
};

exports.deleteMyOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!order) return res.status(404).json({ message: "Order not found" });
    // السماح بالحذف لو أي نوع كنسلة أو delivered أو rejected
    if (
      ![
        "cancelled_by_user",
        "cancelled_by_admin",
        "delivered",
        "rejected",
      ].includes(order.status)
    )
      return res.status(400).json({ message: "Cannot remove this order" });
    await Order.findByIdAndUpdate(req.params.id, { isDeleted: true });
    res.status(200).json({ message: "Order removed" });
  } catch (err) {
    console.error(`Error In deleteMyOrder(): ${err.message}`);
    res.status(500).json({ message: "Deleting Order failed" });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true },
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ message: "Order deleted", data: order });
  } catch (err) {
    console.error(`Error In deleteOrder(): ${err.message}`);
    res.status(500).json({ message: "Deleting Order failed" });
  }
};
