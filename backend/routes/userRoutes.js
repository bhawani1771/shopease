const router = require("express").Router();
const ctrl = require("../controllers/userController");
const { protect, admin } = require("../middleware/authMiddleware");

router.get("/", protect, admin, ctrl.getUsers);
router.put("/profile", protect, ctrl.updateProfile);
router.delete("/:id", protect, admin, ctrl.deleteUser);

module.exports = router;
