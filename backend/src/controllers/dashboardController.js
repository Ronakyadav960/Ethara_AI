const Task = require("../models/Task");

const getDashboardStats = async (req, res, next) => {
  try {
    const now = new Date();
    const baseFilter = req.user.role === "Member" ? { assignedTo: req.user._id } : {};

    const [totalTasks, completedTasks, pendingTasks, overdueTasks] = await Promise.all([
      Task.countDocuments(baseFilter),
      Task.countDocuments({ ...baseFilter, status: "Done" }),
      Task.countDocuments({ ...baseFilter, status: { $ne: "Done" } }),
      Task.countDocuments({
        ...baseFilter,
        dueDate: { $lt: now },
        status: { $ne: "Done" },
      }),
    ]);

    return res.status(200).json({
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
};
