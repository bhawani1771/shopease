// Creates a JWT for a given user id. Used after login/register.
const jwt = require("jsonwebtoken");

function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

module.exports = generateToken;
