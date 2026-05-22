const mongoose = require("mongoose");

// Reviews are embedded inside the product document (simple approach).
const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: "" },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, default: 0 },
    oldPrice: { type: Number, default: 0 }, // for "discount" display
    category: { type: String, required: true },
    image: { type: String, default: "" }, // filename in /uploads or URL
    stock: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
