const mongoose = require("mongoose");

const competitionSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
  },
  des: {
    type: String,
    // required: true,
  },
  venue: {
    type: String,
    // required: true,
  },
  vac: {
    type: "number",
    // required: true,
  },
  image: {
    type: String,
    // required: true,
  },
  teamSize: {
    type: "number",
  },
  participants: [
    { id: { type: mongoose.Schema.Types.ObjectId, ref: "Users" } },
  ],
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  category: [
    {
      name: {
        type: String,
        // required: true,
      },
    },
  ],
  postDate: {
    type: Date,
    require: true,
  },
  postTime: {
    type: "string",
    require: true,
  },
  date: { type: Date, default: Date.now },
  show: {
    type: "Boolean",
    default: "true",
  },
});

const competitionList = new mongoose.model("Competitions", competitionSchema);

module.exports = competitionList;
