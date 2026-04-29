const jwt = require('jsonwebtoken');

// ================= VERIFY TOKEN =================
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    // 🔥 validasi format Bearer
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: "Token tidak ditemukan!" });
    }

    const token = authHeader.split(' ')[1];

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token tidak valid atau kedaluwarsa!" });
    }
};

// ================= ROLE ADMIN =================
const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: "Akses terlarang! Hanya untuk Admin." });
    }
    next();
};

module.exports = { verifyToken, isAdmin };