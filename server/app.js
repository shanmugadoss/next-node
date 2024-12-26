const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");

require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/user", userRoutes);

app.get("/", (req, res) => res.send("Testing Servers"));

module.exports = app;
