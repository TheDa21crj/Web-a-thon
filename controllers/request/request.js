const HttpError = require("../../models/HttpError");
const request = require("../../models/requestSchema");
const Competitions = require("../../models/competitionSchema");
const user = require("../../models/userSchema");
const { check, validationResult } = require("express-validator");
const nodemailer = require("nodemailer");

// Private || Add Competition
const addReq = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    competitionID,
    // userID,
    hostID,
    message,
  } = req.body;

  let users;
  try {
    users = await user.findOne({ email: res.locals.userData.userEmail });

    if (users) {
      try {
        let obj = {
          competitionID,
          userID: users._id,
          hostID,
          message,
        };

        let newObj = new request(obj);
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

// Private || Status Check
const statusCheck = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { competitionID } = req.body;

  let userData;
  try {
    userData = await user.findOne({ email: res.locals.userData.userEmail });

    if (userData) {
      try {
        const requestData = await request.findOne({
          competitionID,
          userID: [userData._id],
        });

        if (!requestData) {
          const error = new HttpError("Wrong competitionID", 400);
          res.status(402).send({ status: false, requestData });
          return next(error);
        }

        return res.status(202).send({ status: true, requestData });
      } catch (e) {
        console.log(e);
        const error = new HttpError("Wrong Email Credentials", 400);
        console.log(e);
        res.status(402).send({ status: false, requestData });
        return next(error);
      }
    }
  } catch (e) {
    const error = new HttpError("Email Not Found", 505);
    console.log(e);
    return next(error);
  }
};

const AcceptReq = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { competitionID, userID } = req.body;

  let comData;
  try {
    comData = await request.findOne({
      competitionID,
    });

    if (comData) {
      comData.status = "accept";

      try {
        let MaincomData = await Competitions.findOne({
          _id: competitionID,
        });

        if (MaincomData.vac >= 1) {
          MaincomData.vac -= 1;
          MaincomData.participants.push(userID);

          if (MaincomData.vac === 0) {
            MaincomData.show = true;
          }

          await comData.save();
          await MaincomData.save();

          return res.status(202).send("Data Saved");
        }

        if (MaincomData.vac === 0) {
          return res.status(400).send("Team Filled");
        }
      } catch (e) {
        const error = new HttpError("Error saving the updated event", 401);
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

const RejectReq = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { competitionID, userID } = req.body;

  let comData;
  try {
    comData = await request.findOne({
      competitionID,
    });

    if (comData) {
      comData.status = "reject";

      try {
        let MaincomData = await Competitions.findOne({
          _id: competitionID,
        });

        if (MaincomData.vac >= 0) {
          MaincomData.vac += 1;
          let userCheck = await Competitions.updateOne(
            { _id: competitionID },
            { $pull: { participants: { _id: userID } } }
          );
          // MaincomData.participants.push(userID);

          if (MaincomData.vac > 0) {
            MaincomData.show = false;
          }

          await comData.save();
          await MaincomData.save();

          return res.status(202).send("Data Changed");
        }
      } catch (e) {
        const error = new HttpError("Error saving the updated event", 401);
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

const RejReq = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { competitionID, userID } = req.body;

  let comData;
  try {
    comData = await request.findOne({
      competitionID,
      userID,
    });

    if (comData) {
      comData.status = "reject";
      try {
        let s = await comData.save();

        console.log("================");
        console.log(comData);

        return res.status(202).send({ msg: "Req Rej", s });
      } catch (e) {
        const error = new HttpError("Error saving the updated event", 401);
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

const AllReqofCom = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { competitionID } = req.body;
  try {
    let comData = await request
      .find({
        competitionID,
        status: "applied",
      })
      .populate("userID")
      .populate("competitionID");

    var userData = res.locals.userData;
    res.status(202).json({ userData, comData });
  } catch (e) {
    const error = new HttpError("Email Not Found", 505);
    console.log(e);
    return next(error);
  }
};

exports.addReq = addReq;
exports.RejReq = RejReq;
exports.RejectReq = RejectReq;
exports.AcceptReq = AcceptReq;
exports.AllReqofCom = AllReqofCom;
exports.statusCheck = statusCheck;
