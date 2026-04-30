const Project = require("../models/Project");
const Task = require("../models/Task");
const { isValidObjectId, validateTaskInput } = require("../utils/validators");

const createTask = async (req, res, next) => {
  try {
    const validationError = validateTaskInput(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const { title, description, projectId, assignedTo, status, priority, dueDate } = req.body;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isProjectMember = project.members.some(
      (memberId) => memberId.toString() === assignedTo
    );

    if (!isProjectMember) {
      return res.status(400).json({ message: "Assigned user must be a project member" });
    }

    const task = await Task.create({
      title,
      description,
      projectId,
      assignedTo,
      status: status || "Todo",
      priority: priority || "Medium",
      dueDate,
    });

    const populatedTask = await Task.findById(task._id)
      .populate("projectId", "title")
      .populate("assignedTo", "name email role");

    return res.status(201).json({
      message: "Task created successfully",
      task: populatedTask,
    });
  } catch (error) {
    next(error);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const { projectId, userId } = req.query;
    const query = {};

    if (projectId) {
      if (!isValidObjectId(projectId)) {
        return res.status(400).json({ message: "Invalid project id" });
      }
      query.projectId = projectId;
    }

    if (userId) {
      if (!isValidObjectId(userId)) {
        return res.status(400).json({ message: "Invalid user id" });
      }
      query.assignedTo = userId;
    }

    if (req.user.role === "Member") {
      query.assignedTo = req.user._id;
    }

    const tasks = await Task.find(query)
      .populate("projectId", "title description")
      .populate("assignedTo", "name email role")
      .sort({ dueDate: 1, createdAt: -1 });

    return res.status(200).json({ tasks });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (req.user.role === "Member" && task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Members can only update their assigned tasks" });
    }

    if (req.user.role === "Member") {
      const { status } = req.body;

      if (!status || !["Todo", "In Progress", "Done"].includes(status)) {
        return res.status(400).json({ message: "Members can only update status" });
      }

      task.status = status;
    } else {
      const { title, description, assignedTo, status, priority, dueDate } = req.body;

      if (title) task.title = title;
      if (description) task.description = description;
      if (assignedTo && isValidObjectId(assignedTo)) {
        const project = await Project.findById(task.projectId);
        const isProjectMember = project.members.some(
          (memberId) => memberId.toString() === assignedTo
        );

        if (!isProjectMember) {
          return res.status(400).json({ message: "Assigned user must be a project member" });
        }

        task.assignedTo = assignedTo;
      }
      if (status && ["Todo", "In Progress", "Done"].includes(status)) task.status = status;
      if (priority && ["Low", "Medium", "High"].includes(priority)) task.priority = priority;
      if (dueDate && !Number.isNaN(new Date(dueDate).getTime())) task.dueDate = dueDate;
    }

    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate("projectId", "title description")
      .populate("assignedTo", "name email role");

    return res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await task.deleteOne();

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
};
