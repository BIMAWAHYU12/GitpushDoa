const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");
const { getRiwayatLengkap } = require("../controllers/riwayatController");

router.get("/", verifyToken, getRiwayatLengkap);

module.exports = router;