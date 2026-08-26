const pool = require("../db");

const createReview = async (req, res) => {
    try {
        const {
            booking_id,
            rating,
            comment
        } = req.body;

        if (!booking_id || !rating) {
            return res.status(400).json({
                message: "Booking and rating are required."
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                message: "Rating must be between 1 and 5."
            });
        }

        // Check booking exists
        const [booking] = await pool.query(
            `SELECT booking_id
             FROM booking
             WHERE booking_id = ?`,
            [booking_id]
        );

        if (booking.length === 0) {
            return res.status(404).json({
                message: "Booking not found."
            });
        }

        // Prevent duplicate review
        const [existing] = await pool.query(
            `SELECT review_id
             FROM review
             WHERE booking_id = ?`,
            [booking_id]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                message: "This booking has already been reviewed."
            });
        }

        const [result] = await pool.query(
            `INSERT INTO review
            (booking_id, rating, comment, review_date)
            VALUES (?, ?, ?, CURDATE())`,
            [booking_id, rating, comment || null]
        );

        res.status(201).json({
            message: "Review submitted successfully!",
            review_id: result.insertId
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to submit review.",
            error: error.message
        });
    }
};


const getBookingReview = async (req, res) => {
    try {
        const { booking_id } = req.params;

        const [reviews] = await pool.query(
            `SELECT *
             FROM review
             WHERE booking_id = ?`,
            [booking_id]
        );

        res.json(reviews);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch review.",
            error: error.message
        });
    }
};


module.exports = {
    createReview,
    getBookingReview
};