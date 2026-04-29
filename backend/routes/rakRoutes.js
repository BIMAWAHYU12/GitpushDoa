const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

const {
  getRak,
  createRak,
  updateRak,
  deleteRak
} = require("../controllers/masterController");

router.get("/", verifyToken, getRak);
router.post("/", verifyToken, isAdmin, createRak);
router.put("/:id", verifyToken, isAdmin, updateRak);
router.delete("/:id", verifyToken, isAdmin, deleteRak);

module.exports = router;