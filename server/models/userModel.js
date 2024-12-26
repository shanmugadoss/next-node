const pool = require("../db");

// Get all users
const getAllUsers = async () => {
  const result = await pool.query("SELECT * FROM users ORDER BY username ASC");
  return result.rows;
};

// Get a user by ID
const getUserById = async (id) => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0];
};

// Create a new user
const createUser = async (username, email, token) => {
  const result = await pool.query(
    "INSERT INTO users (username, email, token) VALUES ($1, $2, $3) RETURNING *",
    [username, email, token]
  );
  return result.rows[0];
};

// Update user token
const updateUserToken = async (id, token) => {
  const result = await pool.query(
    "UPDATE users SET token = $1 WHERE id = $2 RETURNING *",
    [token, id]
  );
  return result.rows[0];
};

// Delete a user
const deleteUser = async (id) => {
  const result = await pool.query("DELETE FROM users WHERE id = $1", [id]);
  return result.rowCount;
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUserToken,
  deleteUser,
};