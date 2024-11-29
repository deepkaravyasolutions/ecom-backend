const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/Auth");

const router = express.Router();

// Login a user
router.post("/", async (req, res) => {
  console.log("username: => ", req.body)
  try {
    const user = await User.findOne({ username: req.body.username });
    console.log("User: => ", user);
    if (!user) return res.status(404).send("User not found");

    const isMatch = bcrypt.compare(req.body.password, user.password);
    if (!isMatch) return res.status(403).send("Invalid credentials");

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
    res.status(200).json({ token });
    // console.log("token is: ", token, " --  and successfully signed in! -- ")
  } catch (error) {
    res.status(500).send("error is: ", error.message);
  }
});

module.exports = router;
