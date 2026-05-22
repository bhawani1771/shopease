const router = require("express").Router();
const ctrl = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/", ctrl.getCart);
router.post("/", ctrl.addToCart);
router.put("/:productId", ctrl.updateQty);
router.delete("/:productId", ctrl.removeItem);

module.exports = router;
