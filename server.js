const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const app = express(); // initialise

//body parser middleware
// it make to able to access req.body

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB config
const db = require("./config/key").mongoURI;

// connect to mongodb
mongoose
  .connect(db)
  .then(() => {
    console.log("connected to mLab");
  })
  .catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("working");
});

const port = process.env.PORT || 7000;

//passport middleware

app.use(passport.initialize());

// passport config

require("./config/passport")(passport);
//use routes
app.use("/api/users", users);
app.use("/api/posts", posts);
app.use("/api/profile", profile);

app.listen(port, () => console.log(`server running on ${port}`));
