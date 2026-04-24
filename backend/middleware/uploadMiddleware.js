const multer = require('multer');
const path = require('path');

// Atur penyimpanan
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Format: 1713800000-namafile.jpg
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Filter file (hanya gambar)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Hanya file gambar yang diperbolehkan!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 } // Batas 2MB
});

module.exports = upload;