const Wishlist = require("../models/Wishlist");

async function getOrCreate(userId) {
  let w = await Wishlist.findOne({ user: userId });
  if (!w) w = await Wishlist.create({ user: userId, products: [] });
  return w;
}

exports.getWishlist = async (req, res, next) => {
  try {
    const w = await getOrCreate(req.user._id);
    await w.populate("products");
    res.json(w);
  } catch (err) {
    next(err);
  }
};

exports.addToWishlist = async (req, res, next) => {
  try {
    const w = await getOrCreate(req.user._id);
    const id = req.params.productId;
    if (!w.products.some((p) => p.toString() === id)) w.products.push(id);
    await w.save();
    await w.populate("products");
    res.json(w);
  } catch (err) {
    next(err);
  }
};

exports.removeFromWishlist = async (req, res, next) => {
  try {
    const w = await getOrCreate(req.user._id);
    w.products = w.products.filter((p) => p.toString() !== req.params.productId);
    await w.save();
    await w.populate("products");
    res.json(w);
  } catch (err) {
    next(err);
  }
};
