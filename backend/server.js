const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// routes
const dashboardRoutes = require("./routes/dashboardRoutes");
app.use("/api", dashboardRoutes);

const barangRoutes = require("./routes/barangRoutes");
app.use("/api", barangRoutes);                        

// port dari .env
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


const riwayatRoutes = require('./routes/riwayatRoutes');

// Gunakan prefix /api/riwayat
app.use('/api/riwayat', riwayatRoutes);


const transaksiRoutes = require('./routes/transaksiRoutes');
// Gunakan prefix /api/transaksi
app.use('/api/transaksi', transaksiRoutes);