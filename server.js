const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { request } = require("express");

const app = express();

dotenv.config();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE,OPTIONS"
  );

  next();
});

app.get("/test", (req, res) => {
  res.send("Hello Server");
});

app.get("/", (req, res) => {
  res.status(202).send("HEllo World");
});

app.use("/api/user", require("./routes/user"));
app.use("/api/competition", require("./routes/competition"));
app.use("/api/request", require("./routes/request"));
app.use("/api/dashborads", require("./routes/dashborads"));

const port = process.env.PORT || 5000;

mongoose.connect(process.env.DB_URI).then(
  app.listen(port, () => {
    console.log("Listining on port " + port);
    console.log("connected");
  })
);
