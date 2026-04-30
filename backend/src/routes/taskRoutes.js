const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getTasks);
router.post("/", allowRoles("Admin"), createTask);
router.put("/:id", updateTask);
router.delete("/:id", allowRoles("Admin"), deleteTask);

module.exports = router;
