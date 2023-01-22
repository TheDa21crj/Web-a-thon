const express = require("express");
const router = express.Router();
const competition = require("../controllers/competition/competition");
const auth = require("../middleWare/auth");
const { check, validationResult } = require("express-validator");

router.get("/getCompetition/:id", competition.ViewCompetition);
router.get("/AllCompetition", competition.AllCompetition);

// auth
router.use(auth);

// Public || Add Competition Data
router.post(
  "/add",
  [check("name", "name is Required").not().isEmpty()],
  [check("des", "des is Required").not().isEmpty()],
  [check("image", "image is Required").not().isEmpty()],
  [check("categoryName", "categoryName is Required").not().isEmpty()],
  [check("teamSize", "teamSize is Required").not().isEmpty()],
  [check("postDate", "postDate is Required").not().isEmpty()],
  [check("postTime", "postTime is Required").not().isEmpty()],
  [check("venue", "venue is Required").not().isEmpty()],
  [check("vac", "vac is Required").not().isEmpty()],
  competition.addCompetition
);

// Public || Edit Competition Data
router.post(
  "/Edit",
  check("_id", "_id is Required").not().isEmpty(),
  competition.EditCompetition
);

// Public || Delete Competition Data
router.delete(
  "/Delete",
  check("_id", "_id is Required").not().isEmpty(),
  competition.DeleteCompetition
);

module.exports = router;
