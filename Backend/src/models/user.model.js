const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: [true, "With this email user account already exists"],
    required: true,
  },
  password: String,
});

const userModel = mongoose.model("registration", userSchema);

module.exports = userModel;
