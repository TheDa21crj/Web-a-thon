const HttpError = require("../../models/HttpError");
const user = require("../../models/userSchema");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const gravatar = require("gravatar");
const bcrypt = require("bcrypt");

const register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, email, password, skills, Linkedin, College } = req.body;

  let users;
  try {
    users = await user.findOne({ email: email });
  } catch (e) {
    const error = new HttpError("Wrong Email Credentials", 400);
    return next(error);
  }

  if (users) {
    res.json({ exists: true });
    return;
  } else {
    let avatar;
    try {
      avatar = gravatar.url(email, { s: "200", r: "pg", d: "mm" });
    } catch (e) {
      const error = new HttpError("gravatar error", 400);
      return next(error);
    }

    console.log("---skills---");
    console.log(skills);

    const newUser = new user({
      name: name,
      email: email,
      password: password,
      avatar: avatar,
      skills,
      Linkedin,
      College,
    });

    try {
      const createduser = await newUser.save();

      let token;

      try {
        token = jwt.sign(
          { userEmail: email, designation: "user" },
          process.env.JWT_SECRATE,
          { expiresIn: "3hr" }
        );
      } catch (err) {
        const error = new HttpError("Error logging user", 401);
        console.log(err);
        return next(error);
      }
      var userinfo = {
        name: name,
        email: email,
        password: password,
        avatar: avatar,
      };
      res.json({ exists: false, token: token, user: userinfo });
    } catch (err) {
      console.log(err);
      const error = new HttpError("Cannot add user", 400);
      return next(error);
    }
  }
};

const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  var validateEmail;
  try {
    validateEmail = await user.findOne({ email });

    console.log(validateEmail);

    if (!validateEmail) {
      const error = new HttpError("Wrong credentials", 400);
      return next(error);
    }

    const isMatch = await bcrypt.compare(password, validateEmail.password);

    if (!isMatch) {
      const error = new HttpError("Wrong credentials", 400);
      return next(error);
    }
    console.log("saveds :- " + validateEmail.password);
    let token;
    try {
      token = jwt.sign(
        {
          userEmail: validateEmail.email,
        },
        process.env.JWT_SECRATE,
        { expiresIn: "3hr" }
      );
    } catch (err) {
      const error = new HttpError("Error error generating token", 401);
      console.log(err);
      return next(error);
    }

    res.status(200).json({ success: true, token: token, user: validateEmail });
  } catch (e) {
    const error = new HttpError("User not found", 500);
    return next(error);
  }
};

exports.login = login;
exports.register = register;
