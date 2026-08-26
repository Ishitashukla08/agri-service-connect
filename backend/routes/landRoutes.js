const express = require("express");

const {
    addLand,
    getFarmerLand
} = require("../controllers/landController");

const router = express.Router();

router.post("/", addLand);
router.get("/farmer/:farmer_id", getFarmerLand);

module.exports = router;