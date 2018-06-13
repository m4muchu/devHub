const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const key = require("../../config/key");
const User = require("../../models/User");
// load input validation

const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
//@route GET api/users/register
//@desc Register user
//@access public

router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "email already exist";
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", //size
        r: "pg", //rating
        d: "mm" // default
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => {
              res.json(user);
            })
            .catch(err => console.log(err));
        });
      });
    }
  });
});

//@route GET api/users/login
//@desc login user and return jwt token
//@access public

router.post("/login", (req, res) => {
  const { isValid, errors } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;
  //find user email
  User.findOne({ email: email }).then(user => {
    //find user
    if (!user) {
      errors.email = "user not found";
      return res.status(404).json(errors);
    }
    // compare the password
    bcrypt.compare(password, user.password).then(isMatch => {
      // isMatch value will be true or false
      if (isMatch) {
        // user matched
        const payload = { id: user._id, name: user.name, avatar: user.avatar }; // create jwt payload

        //sign token
        jwt.sign(
          payload,
          key.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token // Bearer is a kind of protocol used reffer lecture 12 of mern
            });
          }
        );
      } else {
        errors.password = "password is incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

//@route GET api/users/current
//@desc return current user
//@access private

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

module.exports = router;
