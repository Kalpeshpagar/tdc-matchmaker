const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  getCustomers,
  getCustomerById,
  addNote,
  updateStatus,
  seedDummyProfiles,
} = require("../controllers/customerController");

router.get("/", protect, getCustomers);
router.get("/:id", protect, getCustomerById);
router.post("/:id/notes", protect, addNote);
router.patch("/:id/status", protect, updateStatus);
router.post("/seed", seedDummyProfiles); // dev only

module.exports = router;