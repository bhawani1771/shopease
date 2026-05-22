const router = require("express").Router();
const ctrl = require("../controllers/wishlistController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/", ctrl.getWishlist);
router.post("/:productId", ctrl.addToWishlist);
router.delete("/:productId", ctrl.removeFromWishlist);

module.exports = router;
