const User = require("../models/User");

// GET /api/users  (admin)
exports.getUsers = async (_req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// PUT /api/users/profile  (protected)
exports.updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    user.name = req.body.name || user.name;
    user.phone = req.body.phone ?? user.phone;
    user.address = req.body.address ?? user.address;
    if (req.body.password) user.password = req.body.password; // will be hashed
    const updated = await user.save();
    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      address: updated.address,
      isAdmin: updated.isAdmin,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/users/:id  (admin)
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    await user.deleteOne();
    res.json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
};
