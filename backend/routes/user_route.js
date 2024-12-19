const express = require("express");
const User = require("../models/User"); // Adjust the path if needed
const userRouter = express.Router();

// Create a user
userRouter.post("/create", async (req, res) => {
  const { name, email } = req.body;
  try {
    const user = await User.create({ name, email });
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ message: "ServerError", error });
  }
});

// Get all users
userRouter.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "ServerError", error });
  }
});

module.exports = userRouter;
