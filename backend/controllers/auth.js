const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
    try {
        // 1. Cek apakah body ada isinya atau nggak
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ 
                message: "Body request tidak boleh kosong!" 
            });
        }

        const { username, password } = req.body;

        // 2. Validasi field satu per satu
        if (!username || !password) {
            return res.status(400).json({ 
                message: "Username dan password wajib diisi!" 
            });
        }

        // 3. Cek Koneksi & Query ke Database
        const [results] = await db.query("SELECT * FROM users WHERE username = ?", [username]);

        if (results.length === 0) {
            return res.status(401).json({ 
                message: "Username tidak terdaftar!" 
            });
        }

        const user = results[0];

        // 4. Cek Password (Hash Comparison)
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ 
                message: "Password yang Anda masukkan salah!" 
            });
        }

        // 5. Generate Token
        const token = jwt.sign(
            { id: user.id_user, role: user.role },
            process.env.JWT_SECRET || 'secret_igudang_123',
            { expiresIn: '1d' }
        );

        // 6. Response Sukses
        res.status(200).json({
            message: "Login Berhasil",
            token: token,
            user: {
                id: user.id_user,
                username: user.username,
                role: user.role
            }
        });

    } catch (err) {
        // 7. Global Catch (Kalau ada error database atau sistem)
        console.error("[LOGIN ERROR]:", err.message);

        res.status(500).json({ 
            message: "Terjadi kesalahan pada server",
            error: process.env.NODE_ENV === 'development' ? err.message : {} 
        });
    }
});

module.exports = router;