// Cart belongs to a logged-in user.

const Cart = require("../models/Cart");

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
}

// GET /api/cart
exports.getCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    await cart.populate("items.product");
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

// POST /api/cart   body: { productId, qty }
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, qty = 1 } = req.body;
    const cart = await getOrCreateCart(req.user._id);
    const existing = cart.items.find((i) => i.product.toString() === productId);
    if (existing) existing.qty += Number(qty);
    else cart.items.push({ product: productId, qty });
    await cart.save();
    await cart.populate("items.product");
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

// PUT /api/cart/:productId   body: { qty }
exports.updateQty = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    const item = cart.items.find((i) => i.product.toString() === req.params.productId);
    if (!item) {
      res.status(404);
      throw new Error("Item not in cart");
    }
    item.qty = Math.max(1, Number(req.body.qty));
    await cart.save();
    await cart.populate("items.product");
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/cart/:productId
exports.removeItem = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
    await cart.save();
    await cart.populate("items.product");
    res.json(cart);
  } catch (err) {
    next(err);
  }
};
