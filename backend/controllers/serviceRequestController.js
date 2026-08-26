const pool = require("../db");


// Create service request
const createServiceRequest = async (req, res) => {
    try {
        const {
            farmer_id,
            land_id,
            service_id,
            required_date,
            duration,
            description
        } = req.body;

        if (!farmer_id || !land_id || !service_id || !required_date) {
            return res.status(400).json({
                message: "Farmer, land, service and required date are required."
            });
        }

        // Check that the land belongs to this farmer
        const [land] = await pool.query(
            `SELECT land_id
             FROM land
             WHERE land_id = ? AND farmer_id = ?`,
            [land_id, farmer_id]
        );

        if (land.length === 0) {
            return res.status(400).json({
                message: "This land does not belong to the selected farmer."
            });
        }

        // Check service exists
        const [service] = await pool.query(
            `SELECT service_id
             FROM service
             WHERE service_id = ?`,
            [service_id]
        );

        if (service.length === 0) {
            return res.status(404).json({
                message: "Service not found."
            });
        }

        const [result] = await pool.query(
            `INSERT INTO service_request
            (farmer_id, land_id, service_id, request_date,
             required_date, duration, description, status)
            VALUES (?, ?, ?, CURDATE(), ?, ?, ?, 'Pending')`,
            [
                farmer_id,
                land_id,
                service_id,
                required_date,
                duration || null,
                description || null
            ]
        );

        res.status(201).json({
            message: "Service request created successfully!",
            request_id: result.insertId
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to create service request.",
            error: error.message
        });
    }
};


// Get farmer's service requests
const getFarmerRequests = async (req, res) => {
    try {
        const { farmer_id } = req.params;

        const [requests] = await pool.query(
            `SELECT
                sr.request_id,
                s.service_name,
                l.location,
                l.area,
                sr.request_date,
                sr.required_date,
                sr.duration,
                sr.description,
                sr.status
             FROM service_request sr
             JOIN service s
                ON sr.service_id = s.service_id
             JOIN land l
                ON sr.land_id = l.land_id
             WHERE sr.farmer_id = ?
             ORDER BY sr.request_id DESC`,
            [farmer_id]
        );

        res.json(requests);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch service requests.",
            error: error.message
        });
    }
};


module.exports = {
    createServiceRequest,
    getFarmerRequests
};