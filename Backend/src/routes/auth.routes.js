const express = require("express");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

/**POST method */
authRouter.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    /**Checking for email */
    const isUserAlreadyExists = await userModel.findOne({ email });

    if (isUserAlreadyExists) {
      return res.status(409).json({
        message: "User is already exists",
      });
    }

    /**Password setup*/
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    /**Creating token*/
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    /**Creating Token */
    res.cookie("jwt_token", token, {
      httpOnly: true,
      secure: false,
       sameSite: "strict", //Only send cookie when request comes from SAME SITE.
    });

    res.status(201).json({
      message: "User register successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

/**Controller */
/**POST method */

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found with this email address",
      });
    }

    // Compare plain password with hashed password from DB
    const isPasswordMatched = await bcrypt.compare(password, user.password);

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
      { expiresIn: "7d" },
    );

    res.cookie("jwt_token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict", //Only send cookie when request comes from SAME SITE.
    });

    res.status(200).json({
      message: "User logged in",
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = authRouter;
