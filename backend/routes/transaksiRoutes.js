const express = require('express');
const router = express.Router();
const transaksiController = require('../controllers/transaksiController');

// Endpoint utama untuk tabel riwayat di Frontend
router.get('/riwayat-lengkap', transaksiController.getRiwayatLengkap);

module.exports = router;