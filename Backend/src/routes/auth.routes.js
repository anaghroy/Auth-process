const express = require("express");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const authRouter = express.Router();

/**POST method */
authRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  /**Checking for email */
  const isUserAlreadyExists = await userModel.findOne({ email });

  if (isUserAlreadyExists) {
    return res.status(409).json({
      message: "User is already exists",
    });
  }

  /**Password setup*/

  const hash = crypto.createHash("md5").update(password).digest("hex");
  const user = await userModel.create({
    name,
    email,
    password: hash,
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
  });
});

/**Controller */
/**GET method */

authRouter.get("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(404).json({
      message: "User not found with this email address",
    });
  }

  const isPasswordMatched =
    user.password === crypto.createHash("md5").update(password).digest("hex");

    /**Password checking */
  if (!isPasswordMatched) {
    return res.status(401).json({
      message: "Invalid password",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
  );

  res.cookie("jwt_token", token);

  res.status(200).json({
    message: "User logged in",
    user,
  });
});

module.exports = authRouter;
