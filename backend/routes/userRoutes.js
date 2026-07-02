const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const bcrypt = require('bcryptjs');

// Tambahkan ini di userRoutes.js
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
    const { username, password, role } = req.body;
    try {
        // Jika password diisi, update password juga
        if (password && password.trim() !== "") {
            const hashedPassword = await bcrypt.hash(password, 10);
            await db.query(
                "UPDATE users SET username = ?, password = ?, role = ? WHERE id_user = ?", 
                [username, hashedPassword, role, req.params.id]
            );
        } else {
            // Jika password kosong, jangan update password
            await db.query(
                "UPDATE users SET username = ?, role = ? WHERE id_user = ?", 
                [username, role, req.params.id]
            );
        }
        res.json({ message: "User berhasil diupdate" });
    } catch (err) {
        console.error("Error Update:", err);
        res.status(500).json({ message: "Gagal update user: " + err.message });
    }
});

// GET User
router.get('/', verifyToken, isAdmin, async (req, res) => {
    try {
        const [users] = await db.query("SELECT id_user, username, role, last_seen FROM users");
        // Logika status online (aktif dalam 5 menit / 300.000 ms)
        const usersWithStatus = users.map(u => ({
            ...u,
            is_online: u.last_seen && (new Date() - new Date(u.last_seen) < 300000)
        }));
        res.json({ data: usersWithStatus });
    } catch (err) {
        res.status(500).json({ message: "Gagal ambil data" });
    }
});

// POST Tambah User
router.post('/', verifyToken, isAdmin, async (req, res) => {
    const { username, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", 
                       [username, hashedPassword, role]);
        res.status(201).json({ message: "User berhasil ditambah" });
    } catch (err) {
        res.status(500).json({ message: "Gagal menambah user" });
    }
});

// DELETE User
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        await db.query("DELETE FROM users WHERE id_user = ?", [req.params.id]);
        res.json({ message: "User berhasil dihapus" });
    } catch (err) {
        res.status(500).json({ message: "Gagal hapus user" });
    }
});

module.exports = router;