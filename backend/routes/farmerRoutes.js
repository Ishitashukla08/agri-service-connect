const express = require("express");
const router = express.Router();

const pool = require("../db");

// ================= FARMER LOGIN =================

router.post("/login", async (req, res) => {
    try {
        const { contact } = req.body;

        if (!contact) {
            return res.status(400).json({
                message: "Contact number is required."
            });
        }

        const [rows] = await pool.query(
            "SELECT farmer_id, name, contact, location FROM farmer WHERE contact = ?",
            [contact]
        );

        if (rows.length === 0) {
            return res.status(401).json({
                message: "Farmer not found. Please register first."
            });
        }

        res.json({
            message: "Login successful.",
            farmer: rows[0]
        });

    } catch (error) {
        console.error("Farmer login error:", error);

        res.status(500).json({
            message: "Server error during login."
        });
    }
});


// ================= FARMER REGISTER =================

router.post("/register", async (req, res) => {
    try {
        const { name, contact, email, location } = req.body;

        if (!name || !contact || !location) {
            return res.status(400).json({
                message: "Name, contact and location are required."
            });
        }

        const [existing] = await pool.query(
            "SELECT farmer_id FROM farmer WHERE contact = ?",
            [contact]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                message: "A farmer with this contact number already exists."
            });
        }

        const [result] = await pool.query(
            "INSERT INTO farmer (name, contact, email, location) VALUES (?, ?, ?, ?)",
            [name, contact, email || null, location]
        );

        res.status(201).json({
            message: "Farmer registered successfully.",
            farmer_id: result.insertId
        });

    } catch (error) {
        console.error("Farmer registration error:", error);

        res.status(500).json({
            message: "Server error during registration."
        });
    }
});

module.exports = router;
