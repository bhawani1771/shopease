const Order = require("../models/Order");

// POST /api/orders
exports.createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice } =
      req.body;
    if (!items || items.length === 0) {
      res.status(400);
      throw new Error("No order items");
    }
    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

// GET /api/orders/my
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// GET /api/orders   (admin)
exports.getAllOrders = async (_req, res, next) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// PUT /api/orders/:id/status  (admin)
exports.updateStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }
    order.status = req.body.status || order.status;
    if (order.status === "Delivered") order.isPaid = true;
    await order.save();
    res.json(order);
  } catch (err) {
    next(err);
  }
};

// GET /api/orders/stats   (admin) - simple dashboard numbers
exports.getStats = async (_req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const revenueAgg = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const revenue = revenueAgg[0]?.total || 0;
    res.json({ totalOrders, revenue });
  } catch (err) {
    next(err);
  }
};
