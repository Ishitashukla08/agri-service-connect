const express = require("express");

const {
    makePayment,
    getBookingPayment
} = require("../controllers/paymentController");

const router = express.Router();

router.post("/", makePayment);

router.get(
    "/booking/:booking_id",
    getBookingPayment
);

module.exports = router;