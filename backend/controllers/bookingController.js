const pool = require("../db");

const getFarmerBookings = async (req, res) => {
    try {
        const { farmer_id } = req.params;

        const [bookings] = await pool.query(
            `SELECT
                b.booking_id,
                b.request_id,
                b.worker_id,
                w.name AS worker_name,
                s.service_name,
                l.location,
                b.start_date,
                b.end_date,
                b.amount,
                b.status AS booking_status,
                sr.status AS request_status
             FROM booking b
             JOIN service_request sr
                ON b.request_id = sr.request_id
             JOIN worker w
                ON b.worker_id = w.worker_id
             JOIN service s
                ON sr.service_id = s.service_id
             JOIN land l
                ON sr.land_id = l.land_id
             WHERE sr.farmer_id = ?
             ORDER BY b.booking_id DESC`,
            [farmer_id]
        );

        res.json(bookings);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch bookings.",
            error: error.message
        });
    }
};

const getWorkerBookings = async (req, res) => {
    try {
        const { worker_id } = req.params;
        const [bookings] = await pool.query(
            `SELECT b.booking_id, f.name AS farmer_name, s.service_name,
                    l.location, b.start_date, b.end_date, b.amount,
                    b.status AS booking_status
             FROM booking b
             JOIN service_request sr ON b.request_id = sr.request_id
             JOIN farmer f ON sr.farmer_id = f.farmer_id
             JOIN service s ON sr.service_id = s.service_id
             JOIN land l ON sr.land_id = l.land_id
             WHERE b.worker_id = ?
             ORDER BY b.booking_id DESC`,
            [worker_id]
        );
        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch provider bookings." });
    }
};

module.exports = {
    getFarmerBookings,
    getWorkerBookings
};
