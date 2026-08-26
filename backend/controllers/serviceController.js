const pool = require("../db");

const getServices = async (req, res) => {
    try {
        const [services] = await pool.query(
            `SELECT service_id, service_name, category, description
             FROM service`
        );

        res.json(services);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch services.",
            error: error.message
        });
    }
};

module.exports = {
    getServices
};