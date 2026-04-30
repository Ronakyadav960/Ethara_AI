const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/User");
const { isValidObjectId, validateProjectInput } = require("../utils/validators");

const createProject = async (req, res, next) => {
  try {
    const validationError = validateProjectInput(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const { title, description, members = [] } = req.body;

    const validMembers = members.filter((memberId) => isValidObjectId(memberId));
    const uniqueMembers = [...new Set([req.user._id.toString(), ...validMembers])];

    const project = await Project.create({
      title,
      description,
      createdBy: req.user._id,
      members: uniqueMembers,
    });

    const populatedProject = await Project.findById(project._id)
      .populate("createdBy", "name email role")
      .populate("members", "name email role");

    return res.status(201).json({
      message: "Project created successfully",
      project: populatedProject,
    });
  } catch (error) {
    next(error);
  }
};

const getProjects = async (req, res, next) => {
  try {
    let query = {};

    if (req.user.role === "Member") {
      const assignedProjectIds = await Task.distinct("projectId", {
        assignedTo: req.user._id,
      });

      query = {
        _id: { $in: assignedProjectIds },
        members: req.user._id,
      };
    }

    const projects = await Project.find(query)
      .populate("createdBy", "name email role")
      .populate("members", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({ projects });
  } catch (error) {
    next(error);
  }
};

const getProjectById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid project id" });
    }

    const project = await Project.findById(id)
      .populate("createdBy", "name email role")
      .populate("members", "name email role");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    let hasAccess = req.user.role === "Admin";

    if (req.user.role === "Member") {
      const isProjectMember = project.members.some(
        (member) => member._id.toString() === req.user._id.toString()
      );

      const hasAssignedTask = await Task.exists({
        projectId: project._id,
        assignedTo: req.user._id,
      });

      hasAccess = isProjectMember && Boolean(hasAssignedTask);
    }

    if (!hasAccess) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return res.status(200).json({ project });
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid project id" });
    }

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (title) {
      project.title = title;
    }

    if (description) {
      project.description = description;
    }

    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate("createdBy", "name email role")
      .populate("members", "name email role");

    return res.status(200).json({
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid project id" });
    }

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await Task.deleteMany({ projectId: project._id });
    await project.deleteOne();

    return res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const addMembersToProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { memberIds } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid project id" });
    }

    if (!Array.isArray(memberIds) || memberIds.length === 0) {
      return res.status(400).json({ message: "memberIds must be a non-empty array" });
    }

    const validMemberIds = memberIds.filter((memberId) => isValidObjectId(memberId));
    const users = await User.find({ _id: { $in: validMemberIds } }).select("_id");

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const nextMembers = new Set(project.members.map((member) => member.toString()));
    users.forEach((user) => nextMembers.add(user._id.toString()));
    nextMembers.add(project.createdBy.toString());

    project.members = [...nextMembers];
    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate("createdBy", "name email role")
      .populate("members", "name email role");

    return res.status(200).json({
      message: "Members added successfully",
      project: updatedProject,
    });
  } catch (error) {
    next(error);
  }
};

const removeMemberFromProject = async (req, res, next) => {
  try {
    const { id, memberId } = req.params;

    if (!isValidObjectId(id) || !isValidObjectId(memberId)) {
      return res.status(400).json({ message: "Invalid project id or member id" });
    }

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.createdBy.toString() === memberId) {
      return res.status(400).json({ message: "Cannot remove the project creator" });
    }

    project.members = project.members.filter(
      (member) => member.toString() !== memberId
    );
    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate("createdBy", "name email role")
      .populate("members", "name email role");

    return res.status(200).json({
      message: "Member removed successfully",
      project: updatedProject,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMembersToProject,
  removeMemberFromProject,
};
