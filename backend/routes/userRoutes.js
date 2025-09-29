const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { admin } = require("../middlewares/adminMiddleware");
const {
  toggleUserAdmin,
  updatebirthDate,
} = require("../controllers/adminController");

// Update User BirthDate
router.patch("/users/birth-date/:id", protect, updatebirthDate);

router.patch("/users/:id/admin-toggle", protect, toggleUserAdmin);

module.exports = router;
