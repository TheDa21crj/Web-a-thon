const express = require("express");
const router = express.Router();
const dashboard = require("../controllers/Dashboard/dashboard");
const auth = require("../middleWare/auth");
const { check, validationResult } = require("express-validator");

// auth
router.use(auth);

// Private || Get all events from the user
router.post(
  "/Get",
  [check("email", "email is Required").not().isEmpty()],
  dashboard.getUserEvents
);

router.post(
  "/AllReq",
  [check("id", "id is Required").not().isEmpty()],
  dashboard.Allreq
);

router.post(
  "/AllReqUsers",
  [check("id", "id is Required").not().isEmpty()],
  dashboard.AllreqUsers
);

router.post("/Applied", dashboard.Applied);

module.exports = router;
