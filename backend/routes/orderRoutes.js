const router = require("express").Router();
const ctrl = require("../controllers/orderController");
const { protect, admin } = require("../middleware/authMiddleware");

router.post("/", protect, ctrl.createOrder);
router.get("/my", protect, ctrl.getMyOrders);
router.get("/", protect, admin, ctrl.getAllOrders);
router.get("/stats", protect, admin, ctrl.getStats);
router.put("/:id/status", protect, admin, ctrl.updateStatus);

module.exports = router;
