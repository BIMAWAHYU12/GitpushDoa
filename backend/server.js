const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// routes
const dashboardRoutes = require("./routes/dashboardRoutes");
app.use("/api", dashboardRoutes);

// port dari .env
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});