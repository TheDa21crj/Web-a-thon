const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  competition: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Competition",
  },
  skills: [
    {
      name: {
        type: String,
        required: true,
      },
    },
  ],
  portfolio: [
    {
      link: {
        type: "string",
        // required: true,
      },
    },
  ],
  Linkedin: {
    type: "string",
    required: true,
  },
  password: {
    type: "string",
    required: true,
  },
  College: { type: "string", required: true },
  avatar: {
    type: "string",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const userList = new mongoose.model("Users", userSchema);

module.exports = userList;
