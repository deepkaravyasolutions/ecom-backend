const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY;

// // Register a user
// router.post("/register", async (req, res) => {
//   try {
//     const hashedPassword = await bcrypt.hash(req.body.password, 10);
//     const user = new User({ username: req.body.username, password: hashedPassword });
//     await user.save();
//     res.status(201).send("User created");
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// });

// Login a user
router.post("/login", async (req, res) => {
  try {
    console.log("/login page request: ", req.body);
    const user = await User.findOne({ username: req.body.username });
    console.log("user iss: ", user);
    if (!user) return res.status(404).send("User not found");

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) return res.status(403).send("Invalid credentials");

    const token = jwt.sign({ id: user._id }, SECRET_KEY);
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).send("error is: ", error.message);
  }
});

module.exports = router;
