const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

const {
  getOutlet,
  createOutlet,
  updateOutlet,
  deleteOutlet
} = require("../controllers/masterController");

router.get("/", verifyToken, getOutlet);
router.post("/", verifyToken, isAdmin, createOutlet);
router.put("/:id", verifyToken, isAdmin, updateOutlet);
router.delete("/:id", verifyToken, isAdmin, deleteOutlet);

module.exports = router;