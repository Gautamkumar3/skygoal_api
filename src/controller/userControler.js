const UserModal = require("../modal/user");
require("dotenv").config();
const secretKey = process.env.SECRET_KEY;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
  let { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send({
      status: "error",
      message: "User name or Email or password is missing",
    });
  }
  try {
    let user = await UserModal.findOne({ email });
    if (user) {
      return res.status(409).send({
        status: "error",
        message:
          "This email is registered with the other user please try with another email",
      });
    } else {
      let newUser = new UserModal({ name, email, password });
      await newUser.save();
      return res.status(200).send({
        status: "success",
        message: "You are successfully registered.",
      });
    }
  } catch (er) {
    return res.status(500).send({ status: "error", message: er.message });
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .send({ status: "error", message: "Email or password is missing" });
  }
  try {
    const user = await UserModal.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .send({ status: "error", message: "Invalid Credentials" });
    } else {
      const matchUser = await bcrypt.compare(password, user.password);
      if (matchUser) {
        let token = jwt.sign(
          { id: user._id, email: user.email, name: user.name },
          secretKey,
          {
            expiresIn: "1 day",
          }
        );
        return res.status(200).send({
          status: "success",
          message: "Login successfull",
          token: token,
        });
      } else {
        return res
          .status(400)
          .send({ status: "error", message: "Invalid Credentials" });
      }
    }
  } catch (er) {
    return res.status(500).send({ status: "error", message: er.message });
  }
};

const getAllUser = async (req, res) => {
  try {
    let allUser = await UserModal.find({}, { password: 0 });
    return res.status(200).send({
      status: "success",
      message: "All users data get successfully",
      data: allUser,
    });
  } catch (er) {
    return res.status(500).send({ status: "error", message: er.message });
  }
};

module.exports = { registerUser, userLogin, getAllUser };
