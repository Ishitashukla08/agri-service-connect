const pool = require("../db");

const makePayment = async (req, res) => {
    try {
        const { booking_id, amount, payment_method } = req.body;

        if (!booking_id || !amount || !payment_method) {
            return res.status(400).json({
                message: "Booking, amount and payment method are required."
            });
        }

        // Check booking exists
        const [booking] = await pool.query(
            `SELECT booking_id, amount
             FROM booking
             WHERE booking_id = ?`,
            [booking_id]
        );

        if (booking.length === 0) {
            return res.status(404).json({
                message: "Booking not found."
            });
        }

        // Prevent duplicate payment
        const [existing] = await pool.query(
            `SELECT payment_id
             FROM payment
             WHERE booking_id = ?`,
            [booking_id]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                message: "Payment has already been made for this booking."
            });
        }

        const [result] = await pool.query(
            `INSERT INTO payment
            (booking_id, amount, payment_date, payment_method, payment_status)
            VALUES (?, ?, CURDATE(), ?, 'Paid')`,
            [booking_id, amount, payment_method]
        );

        res.status(201).json({
            message: "Payment successful!",
            payment_id: result.insertId
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Payment failed.",
            error: error.message
        });
    }
};


const getBookingPayment = async (req, res) => {
    try {
        const { booking_id } = req.params;

        const [payments] = await pool.query(
            `SELECT *
             FROM payment
             WHERE booking_id = ?`,
            [booking_id]
        );

        res.json(payments);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch payment.",
            error: error.message
        });
    }
};


module.exports = {
    makePayment,
    getBookingPayment
};