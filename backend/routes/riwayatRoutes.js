const express = require('express');
const router = express.Router();
const riwayatController = require('../controllers/riwayatController');

// Endpoint utama untuk tabel riwayat di Frontend
router.get('/lengkap', riwayatController.getRiwayatLengkap);

module.exports = router;