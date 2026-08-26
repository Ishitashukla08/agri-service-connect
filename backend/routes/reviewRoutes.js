const express = require("express");

const {
    createReview,
    getBookingReview
} = require("../controllers/reviewController");

const router = express.Router();

router.post("/", createReview);

router.get(
    "/booking/:booking_id",
    getBookingReview
);

module.exports = router;