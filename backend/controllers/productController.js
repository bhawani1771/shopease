// Products CRUD + filtering/search/sort/pagination + reviews.

const Product = require("../models/Product");

// GET /api/products  ?keyword=&category=&min=&max=&sort=&page=&limit=
exports.getProducts = async (req, res, next) => {
  try {
    const { keyword = "", category = "", min, max, sort = "newest" } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;

    const filter = {};
    if (keyword) filter.name = { $regex: keyword, $options: "i" };
    if (category) filter.category = category;
    if (min || max) {
      filter.price = {};
      if (min) filter.price.$gte = Number(min);
      if (max) filter.price.$lte = Number(max);
    }

    let sortOption = { createdAt: -1 };
    if (sort === "price-asc") sortOption = { price: 1 };
    if (sort === "price-desc") sortOption = { price: -1 };
    if (sort === "rating") sortOption = { rating: -1 };

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ products, page, pages: Math.ceil(total / limit), total });
  } catch (err) {
    next(err);
  }
};

// GET /api/products/featured
exports.getFeatured = async (_req, res, next) => {
  try {
    const products = await Product.find({ isFeatured: true }).limit(8);
    res.json(products);
  } catch (err) {
    next(err);
  }
};

// GET /api/products/categories  -> list of unique categories
exports.getCategories = async (_req, res, next) => {
  try {
    const cats = await Product.distinct("category");
    res.json(cats);
  } catch (err) {
    next(err);
  }
};

// GET /api/products/:id
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate("reviews.user", "name");
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// POST /api/products  (admin, multipart form with optional 'image')
exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, price, oldPrice, category, stock, isFeatured } = req.body;
    const image = req.file ? req.file.filename : req.body.image || "";
    const product = await Product.create({
      name,
      description,
      price,
      oldPrice,
      category,
      stock,
      isFeatured: isFeatured === "true" || isFeatured === true,
      image,
    });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

// PUT /api/products/:id  (admin)
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    const fields = ["name", "description", "price", "oldPrice", "category", "stock", "isFeatured"];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) product[f] = req.body[f];
    });
    if (req.file) product.image = req.file.filename;
    const updated = await product.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/products/:id  (admin)
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    await product.deleteOne();
    res.json({ message: "Product removed" });
  } catch (err) {
    next(err);
  }
};

// POST /api/products/:id/reviews  (protected)
exports.addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    const already = product.reviews.find((r) => r.user.toString() === req.user._id.toString());
    if (already) {
      res.status(400);
      throw new Error("You already reviewed this product");
    }
    product.reviews.push({
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    });
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((a, r) => a + r.rating, 0) / product.reviews.length;
    await product.save();
    res.status(201).json({ message: "Review added" });
  } catch (err) {
    next(err);
  }
};
