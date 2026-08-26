const pool = require("../db");

// Register farmer
const registerFarmer = async (req, res) => {
    try {
        const { name, contact, location } = req.body;

        if (!name || !contact || !location) {
            return res.status(400).json({
                message: "Name, contact and location are required."
            });
        }

        // Check whether contact already exists
        const [existing] = await pool.query(
            "SELECT * FROM farmer WHERE contact = ?",
            [contact]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                message: "Farmer with this contact number already exists."
            });
        }

        const [result] = await pool.query(
            "INSERT INTO farmer (name, contact, location) VALUES (?, ?, ?)",
            [name, contact, location]
        );

        res.status(201).json({
            message: "Farmer registered successfully!",
            farmer_id: result.insertId
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Registration failed.",
            error: error.message
        });
    }
};


// Login farmer using contact number
const loginFarmer = async (req, res) => {
    try {
        const { contact } = req.body;

        if (!contact) {
            return res.status(400).json({
                message: "Contact number is required."
            });
        }

        const [farmers] = await pool.query(
            "SELECT * FROM farmer WHERE contact = ?",
            [contact]
        );

        if (farmers.length === 0) {
            return res.status(404).json({
                message: "Farmer not found. Please register first."
            });
        }

        res.json({
            message: "Login successful!",
            farmer: farmers[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Login failed.",
            error: error.message
        });
    }
};


module.exports = {
    registerFarmer,
    loginFarmer
};