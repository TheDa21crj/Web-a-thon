const HttpError = require("../../models/HttpError");
const user = require("../../models/userSchema");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const nodemailer = require("nodemailer");

const getUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;
  let users;
  try {
    users = await user.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("User not found", 500);
    return next(error);
  }
  let events;
  try {
    events = await event.find({ _id: { $in: users.eventid } });
    console.log(events);
  } catch (err) {
    const error = new HttpError("Creating form failed, please try again.", 500);
    return next(error);
  }

  res.json({ users: users, userevents: events });
};

exports.getUser = getUser;
