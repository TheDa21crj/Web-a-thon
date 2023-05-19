const express = require("express");
const router = express.Router();
const dashboard = require("../controllers/Dashboard/dashboard");
const auth = require("../middleWare/auth");
const { check, validationResult } = require("express-validator");

// auth
router.use(auth);

router.post("/Applied", dashboard.Applied);

// Private || Get all events from the user
router.post(
  "/Get",
  [check("email", "email is Required").not().isEmpty()],
  dashboard.getUserEvents
);

// Private ||  All Req for Competition
router.post(
  "/AllReq",
  [check("id", "id is Required").not().isEmpty()],
  dashboard.Allreq
);

// Private || All Requesed Users
router.post(
  "/AllReqUsers",
  [check("id", "id is Required").not().isEmpty()],
  dashboard.AllreqUsers
);

module.exports = router;
