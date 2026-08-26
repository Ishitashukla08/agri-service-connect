const express = require("express");

const {
    createServiceRequest,
    getFarmerRequests
} = require("../controllers/serviceRequestController");

const router = express.Router();

router.post("/", createServiceRequest);

router.get(
    "/farmer/:farmer_id",
    getFarmerRequests
);

module.exports = router;