const express = require("express");

const {
    getFarmerBookings,
    getWorkerBookings
} = require("../controllers/bookingController");

const router = express.Router();

router.get(
    "/farmer/:farmer_id",
    getFarmerBookings
);

router.get("/worker/:worker_id", getWorkerBookings);

module.exports = router;
