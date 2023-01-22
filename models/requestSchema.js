const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  competitionID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Competitions",
    required: true,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  hostID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  message: {
    type: "string",
    required: true,
  },
  status: {
    type: "string",
    required: true,
    default: "applied",
  },
  date: { type: Date, default: Date.now },
});

const RequestList = new mongoose.model("Request", requestSchema);

module.exports = RequestList;
