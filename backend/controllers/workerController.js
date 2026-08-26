const pool = require("../db");


// Get service requests available for a worker
const getWorkerRequests = async (req, res) => {
    try {
        const { worker_id } = req.params;

        const [requests] = await pool.query(
            `SELECT
                sr.request_id,
                f.name AS farmer_name,
                l.location,
                l.area,
                s.service_name,
                sr.required_date,
                sr.duration,
                sr.description,
                sr.status
             FROM service_request sr
             JOIN farmer f
                ON sr.farmer_id = f.farmer_id
             JOIN land l
                ON sr.land_id = l.land_id
             JOIN service s
                ON sr.service_id = s.service_id
             JOIN worker_service ws
                ON sr.service_id = ws.service_id
             WHERE ws.worker_id = ?
             AND sr.status = 'Pending'
             ORDER BY sr.required_date`,
            [worker_id]
        );

        res.json(requests);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch worker requests.",
            error: error.message
        });
    }
};

const acceptRequest = async (req, res) => {
    const connection = await pool.getConnection();

    try {
        const { request_id } = req.params;

        const {
            worker_id,
            start_date,
            end_date
        } = req.body;

        if (!worker_id || !start_date || !end_date) {
            return res.status(400).json({
                message: "Worker, start date and end date are required."
            });
        }

        await connection.beginTransaction();

        // Get request
        const [requests] = await connection.query(
            `SELECT
                request_id,
                service_id,
                duration,
                status
             FROM service_request
             WHERE request_id = ?
             FOR UPDATE`,
            [request_id]
        );

        if (requests.length === 0) {
            await connection.rollback();

            return res.status(404).json({
                message: "Service request not found."
            });
        }

        const request = requests[0];

        if (request.status !== "Pending") {
            await connection.rollback();

            return res.status(400).json({
                message: "This request has already been processed."
            });
        }

        // Check worker provides this service
        const [workerService] = await connection.query(
            `SELECT rate
             FROM worker_service
             WHERE worker_id = ?
             AND service_id = ?`,
            [worker_id, request.service_id]
        );

        if (workerService.length === 0) {
            await connection.rollback();

            return res.status(400).json({
                message: "Worker does not provide this service."
            });
        }

        const rate = Number(workerService[0].rate || 0);
        const duration = Number(request.duration || 1);

        const amount = rate * duration;

        // Create booking
        const [booking] = await connection.query(
            `INSERT INTO booking
            (request_id, worker_id, start_date, end_date, amount, status)
            VALUES (?, ?, ?, ?, ?, 'Booked')`,
            [
                request_id,
                worker_id,
                start_date,
                end_date,
                amount
            ]
        );

        // Update request
        await connection.query(
            `UPDATE service_request
             SET status = 'Accepted'
             WHERE request_id = ?`,
            [request_id]
        );

        await connection.commit();

        res.json({
            message: "Request accepted and booking created successfully!",
            booking_id: booking.insertId,
            amount: amount
        });

    } catch (error) {

        await connection.rollback();

        console.error(error);

        res.status(500).json({
            message: "Failed to accept request.",
            error: error.message
        });

    } finally {
        connection.release();
    }
};

const getWorkersByService = async (req, res) => {
    try {
        const { service_id } = req.params;

        const [workers] = await pool.query(
            `SELECT
                w.worker_id,
                w.name,
                w.location,
                w.service_range,
                w.availability,
                ws.rate
             FROM worker w
             JOIN worker_service ws
                ON w.worker_id = ws.worker_id
             WHERE ws.service_id = ?
             AND w.availability = 1
             ORDER BY w.name`,
            [service_id]
        );

        res.json(workers);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch workers.",
            error: error.message
        });
    }
};

module.exports = {
    getWorkerRequests,
    acceptRequest,
    getWorkersByService
};