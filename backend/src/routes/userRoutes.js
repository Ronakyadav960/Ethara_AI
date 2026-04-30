const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");
const { getUsers } = require("../controllers/userController");

const router = express.Router();

router.use(authMiddleware);
router.get("/", allowRoles("Admin"), getUsers);

module.exports = router;
