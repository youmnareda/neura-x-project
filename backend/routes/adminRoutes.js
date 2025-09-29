const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { admin } = require("../middlewares/adminMiddleware");
const {
  getAllUsers,
  deleteUser,
  getAllScans,
  deleteScanById,
  toggleUserAdmin,
} = require("../controllers/adminController");
const { updateGender, updatebirthDate } = require("../controllers/userController");

// For the user's info
router.get("/users", protect, admin, getAllUsers);
router.delete("/users/:id", protect, admin, deleteUser);

// For the user's scan
router.get("/scans", protect, admin, getAllScans);
router.delete("/scans/:id", protect, admin, deleteScanById);


router.patch("/users/:id/admin-toggle", protect, admin, toggleUserAdmin);


// Update User Gender
router.patch("/users/gender/:id", protect, updateGender);

// Update User BirthDate
router.patch("/users/birth-date/:id", protect, updatebirthDate);

module.exports = router;
