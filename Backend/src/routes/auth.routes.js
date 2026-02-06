const express = require("express");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

const authRouter = express.Router();

/**POST method */
authRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  /**Checking for email */
  const isUserAlreadyExists = await userModel.findOne({ email });

  if (isUserAlreadyExists) {
    return res.status(400).json({
      message: "User is already exists",
    });
  }

  const user = await userModel.create({
    name,
    email,
    password,
  });

  /**Creating token*/
  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
  );
  /**Creating Token */
  res.cookie("jwt_token", token);

  res.status(201).json({
    message: "User register successfully",
    user,
    token,
  });
});

module.exports = authRouter;
