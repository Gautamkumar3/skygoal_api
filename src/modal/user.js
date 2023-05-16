const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
  name: { type: String, required: [true, "user name is missing"] },
  email: {
    type: String,
    required: [true, "email is missing"],
    unique: true,
    validate: [validator.isEmail, "Please enter valid email address"],
  },
  password: { type: String, required: [true, "password is missing"] },
});

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 6);
  next();
});

const User = mongoose.model("user", userSchema);

module.exports = User;
