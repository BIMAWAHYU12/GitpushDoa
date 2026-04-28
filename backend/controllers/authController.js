const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ================= REGISTER =================
exports.register = async (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username dan password wajib diisi!" });
    }

    try {
        // Cek username
        const [existingUser] = await db.query(
            "SELECT id_user FROM users WHERE username = ?",
            [username]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({ message: "Username sudah digunakan!" });
        }

        // 🔥 Validasi role (biar ga bisa inject admin sembarangan)
        const allowedRoles = ['admin', 'staff'];
        const finalRole = allowedRoles.includes(role) ? role : 'staff';

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        await db.query(
            "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
            [username, hashedPassword, finalRole]
        );

        res.status(201).json({
            message: "User berhasil didaftarkan!",
            data: {
                username,
                role: finalRole
            }
        });

    } catch (err) {
        console.error("[REGISTER ERROR]:", err.message);
        res.status(500).json({ message: "Gagal mendaftarkan user" });
    }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username dan password wajib diisi!" });
        }

        // Cari user
        const [results] = await db.query(
            "SELECT * FROM users WHERE username = ?",
            [username]
        );

        if (results.length === 0) {
            return res.status(401).json({ message: "Username tidak terdaftar!" });
        }

        const user = results[0];

        // Compare password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: "Password salah!" });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.id_user, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: "Login berhasil",
            token,
            user: {
                id: user.id_user,
                username: user.username,
                role: user.role
            }
        });

    } catch (err) {
        console.error("[LOGIN ERROR]:", err.message);
        res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
};