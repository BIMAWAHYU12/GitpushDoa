const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const { getOutlet, createOutlet, updateOutlet, deleteOutlet } = require("../controllers/outletController");

const upload = require("../middleware/uploadMiddleware"); 

router.get("/", verifyToken, getOutlet);

router.post("/", verifyToken, isAdmin, upload.single("gambar"), createOutlet);
router.put("/:id", verifyToken, isAdmin, upload.single("gambar"), updateOutlet);

router.delete("/:id", verifyToken, isAdmin, deleteOutlet);

module.exports = router;