const pool = require("../db");

// Add land for a farmer
const addLand = async (req, res) => {
    try {
        const {
            farmer_id,
            area,
            location,
            irrigation_available
        } = req.body;

        if (!farmer_id || !area || !location) {
            return res.status(400).json({
                message: "Farmer ID, area and location are required."
            });
        }

        // Check farmer exists
        const [farmer] = await pool.query(
            "SELECT farmer_id FROM farmer WHERE farmer_id = ?",
            [farmer_id]
        );

        if (farmer.length === 0) {
            return res.status(404).json({
                message: "Farmer not found."
            });
        }

        const [result] = await pool.query(
            `INSERT INTO land
            (farmer_id, area, location, irrigation_available)
            VALUES (?, ?, ?, ?)`,
            [
                farmer_id,
                area,
                location,
                irrigation_available || false
            ]
        );

        res.status(201).json({
            message: "Land registered successfully!",
            land_id: result.insertId
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to register land.",
            error: error.message
        });
    }
};


// Get all land belonging to a farmer
const getFarmerLand = async (req, res) => {
    try {
        const { farmer_id } = req.params;

        const [lands] = await pool.query(
            `SELECT land_id, farmer_id, area, location,
                    irrigation_available
             FROM land
             WHERE farmer_id = ?`,
            [farmer_id]
        );

        res.json(lands);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch land.",
            error: error.message
        });
    }
};


module.exports = {
    addLand,
    getFarmerLand
};