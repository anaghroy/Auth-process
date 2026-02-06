const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: [true, "The email is already existing"],
  },
  password: String,
});

const userModel = mongoose.model("registration", userSchema);

module.export = userModel;
