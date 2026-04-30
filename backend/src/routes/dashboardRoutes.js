const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getDashboardStats } = require("../controllers/dashboardController");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getDashboardStats);

module.exports = router;
