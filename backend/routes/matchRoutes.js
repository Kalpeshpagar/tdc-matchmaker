const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { getMatches, sendMatch, generateAIIntro } = require("../controllers/matchController");

router.get("/:customerId", protect, getMatches);
router.post("/:customerId/send", protect, sendMatch);
router.post("/:customerId/ai-intro", protect, generateAIIntro);

module.exports = router;