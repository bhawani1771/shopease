// Verifies JWT in the Authorization header and loads the user onto req.user.

const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function protect(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    if (!header.startsWith("Bearer ")) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      res.status(401);
      throw new Error("User not found");
    }
    next();
  } catch (err) {
    res.status(401);
    next(err);
  }
}

function admin(req, res, next) {
  if (req.user && req.user.isAdmin) return next();
  res.status(403);
  next(new Error("Admin access only"));
}

module.exports = { protect, admin };
