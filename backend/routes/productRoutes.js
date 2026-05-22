const router = require("express").Router();
const ctrl = require("../controllers/productController");
const { protect, admin } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.get("/", ctrl.getProducts);
router.get("/featured", ctrl.getFeatured);
router.get("/categories", ctrl.getCategories);
router.get("/:id", ctrl.getProduct);

router.post("/", protect, admin, upload.single("image"), ctrl.createProduct);
router.put("/:id", protect, admin, upload.single("image"), ctrl.updateProduct);
router.delete("/:id", protect, admin, ctrl.deleteProduct);

router.post("/:id/reviews", protect, ctrl.addReview);

module.exports = router;
