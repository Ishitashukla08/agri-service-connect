const serviceRoutes = require("./routes/serviceRoutes");
const serviceRequestRoutes = require("./routes/serviceRequestRoutes");
const workerRoutes = require("./routes/workerRoutes");

require("dotenv").config();

const express = require("express");
const cors = require("cors");

const pool = require("./db");

const farmerRoutes = require("./routes/farmerRoutes");
const landRoutes = require("./routes/landRoutes");

const app = express();

// Development-friendly CORS: the frontend may be opened through VS Code Live Server
// on a different localhost port.
app.use(cors({ origin: true }));
app.use(express.json());


// Home
app.get("/", (req, res) => {
    res.json({
        message: "Agri Service Connect backend is running!"
    });
});

app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "agri-service-connect-api" });
});


// Test database
app.get("/api/test-db", async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT 1 AS result"
        );

        res.json({
            message: "Database connected successfully!",
            result: rows[0].result
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Database connection failed.",
            error: error.message
        });
    }
});

const paymentRoutes = require("./routes/paymentRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const bookingRoutes = require("./routes/bookingRoutes");


// Routes
app.use("/api/farmers", farmerRoutes);
app.use("/api/land", landRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/service-requests", serviceRequestRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/bookings", bookingRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

