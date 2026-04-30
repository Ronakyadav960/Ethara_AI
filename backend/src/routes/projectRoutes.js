const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMembersToProject,
  removeMemberFromProject,
} = require("../controllers/projectController");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getProjects);
router.get("/:id", getProjectById);
router.post("/", allowRoles("Admin"), createProject);
router.put("/:id", allowRoles("Admin"), updateProject);
router.delete("/:id", allowRoles("Admin"), deleteProject);
router.post("/:id/members", allowRoles("Admin"), addMembersToProject);
router.delete("/:id/members/:memberId", allowRoles("Admin"), removeMemberFromProject);

module.exports = router;
