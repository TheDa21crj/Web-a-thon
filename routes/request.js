const express = require("express");
const router = express.Router();
const request = require("../controllers/request/request");
const auth = require("../middleWare/auth");
const { check, validationResult } = require("express-validator");

// auth
router.use(auth);

// Private || Add Request to join a event
router.post(
  "/Add",
  [check("competitionID", "competitionID is Required").not().isEmpty()],
  [check("hostID", "hostID is Required").not().isEmpty()],
  [check("message", "message is Required").not().isEmpty()],
  request.addReq
);

// Private || Request Status Check
router.post(
  "/Status",
  [check("competitionID", "competitionID is Required").not().isEmpty()],
  request.statusCheck
);

// Private || Request Accept Par.
router.post(
  "/AcceptReq",
  [check("competitionID", "competitionID is Required").not().isEmpty()],
  [check("userID", "userID is Required").not().isEmpty()],
  request.AcceptReq
);

// Private || Request Remove Par.
router.post(
  "/RemoveReq",
  [check("competitionID", "competitionID is Required").not().isEmpty()],
  [check("userID", "userID is Required").not().isEmpty()],
  request.RejectReq
);

// Private || Request Reject Par.
router.post(
  "/Reject",
  [check("competitionID", "competitionID is Required").not().isEmpty()],
  [check("userID", "userID is Required").not().isEmpty()],
  request.RejReq
);

// Private || All reqs of competitions
router.post(
  "/AllReqofCom",
  [check("competitionID", "competitionID is Required").not().isEmpty()],
  request.AllReqofCom
);

module.exports = router;
