const express = require("express");

const router = express.Router();

const pool = require("../db");

const {
    getWorkerRequests,
    acceptRequest,
    getWorkersByService
} = require("../controllers/workerController");



// ================= WORKER LOGIN =================

router.post("/login", async (req, res) => {

    try {

        const { contact } = req.body;

        if (!contact) {
            return res.status(400).json({
                message: "Contact number is required."
            });
        }

        const [rows] = await pool.query(
            `SELECT worker_id, name, contact, location,
                    service_range, availability, email
             FROM worker
             WHERE contact = ?`,
            [contact]
        );

        if (rows.length === 0) {

            return res.status(404).json({
                message: "Service provider not found."
            });

        }

        res.json({
            message: "Login successful.",
            worker: rows[0]
        });

    } catch (error) {

        console.error("Worker login error:", error);

        res.status(500).json({
            message: "Worker login failed."
        });

    }

});


// ================= WORKER REQUESTS =================

router.get(
    "/service/:service_id",
    getWorkersByService
);


router.get(
    "/:worker_id/requests",
    getWorkerRequests
);


// ================= ACCEPT REQUEST =================

router.post(
    "/requests/:request_id/accept",
    acceptRequest
);





module.exports = router;