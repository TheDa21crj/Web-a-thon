const HttpError = require("../../models/HttpError");
const Competitions = require("../../models/competitionSchema");
const request = require("../../models/requestSchema");
const user = require("../../models/userSchema");
const { check, validationResult } = require("express-validator");
const nodemailer = require("nodemailer");

// Private || All Events of the user
const getUserEvents = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;

  let users;
  try {
    users = await user.findOne({ email });

    if (!user) {
      const error = new HttpError("Wrong email", 400);
      return next(error);
    }

    let competitionData = await Competitions.find({
      host: users._id,
    }).populate("host");

    res.status(202).send(competitionData);
  } catch (e) {
    const error = new HttpError("Server Error", 505);
    console.log(e);
    return next(error);
  }
};

// Private || All Req for Competition
const Allreq = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.body;

  let comData;
  try {
    comData = await request
      .find({
        competitionID: id,
        status: "applied",
      })
      .populate("userID");

    res.status(202).send(comData);
  } catch (e) {
    const error = new HttpError("Email Not Found", 505);
    console.log(e);
    return next(error);
  }
};

// Private || All Req for Competition
const AllreqUsers = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.body;

  let userData;
  try {
    userData = await user.findOne({ email: res.locals.userData.userEmail });

    if (userData) {
      let comData;
      try {
        comData = await request
          .findOne({
            competitionID: id,
          })
          .populate("competitionID");

        res.status(202).send(comData);
      } catch (e) {
        const error = new HttpError("Email Not Found", 505);
        console.log(e);
        return next(error);
      }
    }
  } catch (e) {
    const error = new HttpError("Wrong Email Credentials", 400);
    console.log(e);
    return next(error);
  }
};

const Applied = async (req, res, next) => {
  let userData;

  try {
    userData = await user.findOne({ email: res.locals.userData.userEmail });

    let comData;
    try {
      comData = await request
        .find({
          userID: userData._id,
        })
        .populate("competitionID")
        .populate("hostID");

      res.status(202).send(comData);
    } catch (e) {
      const error = new HttpError("Email Not Found", 505);
      console.log(e);
      return next(error);
    }
  } catch (e) {
    const error = new HttpError("Email Not Found", 505);
    console.log(e);
    return next(error);
  }
};

exports.getUserEvents = getUserEvents;
exports.AllreqUsers = AllreqUsers;
exports.Allreq = Allreq;
exports.Applied = Applied;
