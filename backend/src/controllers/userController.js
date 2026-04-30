const User = require("../models/User");

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    return res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
};
