const express = require("express");
const router = express.Router();

const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

const {
  getRak, createRak, updateRak, deleteRak,
  getSupplier, createSupplier, updateSupplier, deleteSupplier,
  getOutlet, createOutlet, updateOutlet, deleteOutlet
} = require("../controllers/masterController");

// ===== RAK =====
router.get("/rak", verifyToken, getRak);
router.post("/rak", verifyToken, isAdmin, createRak);
router.put("/rak/:id", verifyToken, isAdmin, updateRak);
router.delete("/rak/:id", verifyToken, isAdmin, deleteRak);

// ===== SUPPLIER =====
router.get("/supplier", verifyToken, getSupplier);
router.post("/supplier", verifyToken, isAdmin, createSupplier);
router.put("/supplier/:id", verifyToken, isAdmin, updateSupplier);
router.delete("/supplier/:id", verifyToken, isAdmin, deleteSupplier);

// ===== OUTLET =====
router.get("/outlet", verifyToken, getOutlet);
router.post("/outlet", verifyToken, isAdmin, createOutlet);
router.put("/outlet/:id", verifyToken, isAdmin, updateOutlet);
router.delete("/outlet/:id", verifyToken, isAdmin, deleteOutlet);

module.exports = router;