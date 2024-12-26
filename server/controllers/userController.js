const userModel = require("../models/userModel");

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.getUserById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Create a new user
const createUser = async (req, res) => {
  try {
    const { username, email, token } = req.body;

    if (!username || !email || !token) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newUser = await userModel.createUser(username, email, token);
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update user token
const updateUserToken = async (req, res) => {
  try {
    const { id } = req.params;
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }

    const user = await userModel.updateUserToken(id, token);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    //res.status(200).json({ message: "User was updated!" });
    res.status(200).json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const rowCount = await userModel.deleteUser(id);

    if (!rowCount) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User was deleted!" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUserToken,
  deleteUser,
};
