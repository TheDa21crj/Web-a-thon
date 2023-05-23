const HttpError = require("../../models/HttpError");
const Competitions = require("../../models/competitionSchema");
const user = require("../../models/userSchema");
const { check, validationResult } = require("express-validator");
const nodemailer = require("nodemailer");

// Private || Add Competition
const addCompetition = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    name,
    des,
    image,
    categoryName,
    venue,
    vac,
    postDate,
    postTime,
    teamSize,
  } = req.body;

  let users;
  try {
    users = await user.findOne({ email: res.locals.userData.userEmail });

    if (users) {
      try {
        let obj = {
          name,
          des,
          image,
          category: {},
          venue,
          vac,
          postDate,
          postTime,
          teamSize,
          host: users._id,
        };
        obj.category.name = categoryName;
        let newObj = new Competitions(obj);
        await newObj.save();
        res.status(202).send("Saved");
      } catch (e) {
        const error = new HttpError("Server Error", 505);
        console.log(e);
        return next(error);
      }
    }
  } catch (e) {
    const error = new HttpError("Email Not Found", 505);
    console.log(e);
    return next(error);
  }
};

// Private || Edit Competition
const EditCompetition = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    _id,
    name,
    des,
    image,
    teamSize,
    participants,
    host,
    category,
    date,
    show,
    postDate,
    venue,
    vac,
  } = req.body;

  let userData;
  try {
    userData = await user.findOne({ email: res.locals.userData.userEmail });

    if (userData) {
      let users;
      try {
        users = await Competitions.findOne({ _id });

        console.log(users);
      } catch (e) {
        const error = new HttpError("Wrong Email Credentials", 400);
        return next(error);
      }

      if (users) {
        users.name = name;
        users.des = des;
        users.image = image;
        users.teamSize = teamSize;
        users.participants = participants;
        users.host = host;
        users.category = category;
        users.date = date;
        users.show = show;
        users.postDate = postDate;
        users.venue = venue;
        users.vac = vac;
      }
      try {
        await users.save();
        return res.status(200).json({ success: true });
      } catch (err) {
        const error = new HttpError("Error saving the updated event", 401);
        console.log(err);
        return next(error);
      }
    }
  } catch (e) {
    const error = new HttpError("Email Not Found", 505);
    console.log(e);
    return next(error);
  }
};

// Private || Delete Competition
const DeleteCompetition = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { _id } = req.body;

  let userData;
  try {
    userData = await user.findOne({ email: res.locals.userData.userEmail });
    if (userData) {
      let userCheck = await Competitions.deleteOne({
        _id,
      });

      res.status(202).json(userCheck);
    }
  } catch (e) {
    const error = new HttpError("Email Not Found", 505);
    console.log(e);
    return next(error);
  }
};

// Public || View Competition
const ViewCompetition = async (req, res, next) => {
  try {
    let comData = await Competitions.findById(req.params.id)
      .populate("host")
      .populate({
        path: "participants",
        populate: { path: "_id", model: "Users" },
      });

    console.log(comData);
    res.status(202).send(comData);
  } catch (err) {
    res.json({ form: false });
    const error = new HttpError(
      "Something went wrong, could not find Competion.",
      500
    );
    return next(error);
  }
};

// Public || All  Competition
const AllCompetition = async (req, res, next) => {
  try {
    let data = await Competitions.find().sort({ date: -1 });
    res.status(202).json(data);
  } catch (e) {
    const error = new HttpError("Server Error", 505);
    return next(e);
  }
};

exports.addCompetition = addCompetition;
exports.EditCompetition = EditCompetition;
exports.DeleteCompetition = DeleteCompetition;
exports.ViewCompetition = ViewCompetition;
exports.AllCompetition = AllCompetition;
