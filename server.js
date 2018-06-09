const express = require("express");
const mongoose = require("mongoose");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const app = express(); // initialise

// DB config
const db = require("./config/key").mongoURI;

// connect to mongodb
mongoose
  .connect(db)
  .then(() => {
    console.log("connected to mLab");
  })
  .catch(err => console.log(err));

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("working");
});

//use routes
app.use("/api/users", users);
app.use("/api/posts", posts);
app.use("/api/profile", profile);

app.listen(port, () => console.log(`server running on ${port}`));
