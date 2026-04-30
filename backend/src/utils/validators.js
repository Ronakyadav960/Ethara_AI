const mongoose = require("mongoose");

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const validateSignupInput = ({ name, email, password }) => {
  if (!name || !email || !password) {
    return "Name, email, and password are required";
  }

  if (!isValidEmail(email)) {
    return "Invalid email format";
  }

  if (password.length < 6) {
    return "Password must be at least 6 characters";
  }

  return null;
};

const validateLoginInput = ({ email, password }) => {
  if (!email || !password) {
    return "Email and password are required";
  }

  if (!isValidEmail(email)) {
    return "Invalid email format";
  }

  return null;
};

const validateProjectInput = ({ title, description }) => {
  if (!title || !description) {
    return "Title and description are required";
  }

  return null;
};

const validateTaskInput = ({
  title,
  description,
  projectId,
  assignedTo,
  dueDate,
  status,
  priority,
}) => {
  if (!title || !description || !projectId || !assignedTo || !dueDate) {
    return "Title, description, projectId, assignedTo, and dueDate are required";
  }

  if (!isValidObjectId(projectId) || !isValidObjectId(assignedTo)) {
    return "Invalid projectId or assignedTo";
  }

  if (status && !["Todo", "In Progress", "Done"].includes(status)) {
    return "Invalid status";
  }

  if (priority && !["Low", "Medium", "High"].includes(priority)) {
    return "Invalid priority";
  }

  if (Number.isNaN(new Date(dueDate).getTime())) {
    return "Invalid dueDate";
  }

  return null;
};

module.exports = {
  isValidObjectId,
  validateSignupInput,
  validateLoginInput,
  validateProjectInput,
  validateTaskInput,
};
