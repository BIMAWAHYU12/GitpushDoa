const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

const {
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier
} = require("../controllers/masterController");

router.get("/", verifyToken, getSupplier);
router.post("/", verifyToken, isAdmin, createSupplier);
router.put("/:id", verifyToken, isAdmin, updateSupplier);
router.delete("/:id", verifyToken, isAdmin, deleteSupplier);

module.exports = router;