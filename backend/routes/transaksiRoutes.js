const express = require('express');
const router = express.Router();
const transaksiController = require('../controllers/transaksiController');

// Endpoint: POST http://localhost:5000/api/transaksi/tambah
router.post('/tambah', transaksiController.createTransaksi);

module.exports = router;