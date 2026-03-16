const express = require('express');
const router = express.Router();
const db = require('./config/db'); // Koneksi MySQL kamu
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // 1. Cari user berdasarkan username
    const query = "SELECT * FROM users WHERE username = ?";
    db.query(query, [username], async (err, results) => {
        if (err) return res.status(500).json({ message: "Server Error" });
        if (results.length === 0) return res.status(401).json({ message: "Username tidak ditemukan" });

        const user = results[0];

        // 2. Bandingkan password input dengan password di database (Hash)
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: "Password salah!" });

        // 3. Jika cocok, buat JWT Token
        const token = jwt.sign(
            { id: user.id_user, role: user.role },
            process.env.JWT_SECRET || 'secret_igudang_123',
            { expiresIn: '1d' } // Token berlaku 1 hari
        );

        // 4. Kirim response ke Frontend (React)
        res.json({
            message: "Login Berhasil",
            token: token,
            user: {
                id: user.id_user,
                username: user.username,
                role: user.role
            }
        });
    });
});

module.exports = router;