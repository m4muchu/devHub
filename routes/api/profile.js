const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//load models
const Profile = require("../../models/Profile");
const Users = require("../../models/User");

// load validation
const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");

// here the route will start from /api/users/test /api/users came from server.js
router.get("/test", (req, res) => res.json({ msg: "profile works" }));

//@route GET api/profile
//@desc get current user profile
//@access private

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"]) // acces the data from users schema model,there is ref in profile model
      .then(profile => {
        if (!profile) {
          errors.noProfile = "there is no profile for this user";
          return res.status(404).json(errors);
        }

        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

//@route GET api/profile/all
//@desc get all profile
//@access public

router.get("/all", (req, res) => {
  const errors = {};

  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      if (!profiles) {
        errors.noProfile = "no profiles available";
        return res.status(404).json(errors);
      }

      res.json(profiles);
    })
    .catch(err => res.json({ profile: "there is no profile" }));
});

//@route GET api/profile/handle/:handle
//@desc get profile by handle
//@access public

router.get("/handle/:handle", (req, res) => {
  // :handle will the variable given through params
  const errors = {};

  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noProfile = "There is no profile for this user";
        return res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

//@route GET api/profile/user/:user_id
//@desc get profile by user_id
//@access public

router.get("/user/:user_id", (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noProfile = "There is no profile for this user";
        return res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err =>
      res.status(404).json({ profile: "there is no profile for this user" })
    );
});

//@route POST api/profile
//@desc create user or edit profile
//@access private

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    profileField = {};

    profileField.user = req.user.id;
    if (req.body.handle) profileField.handle = req.body.handle;
    if (req.body.company) profileField.company = req.body.company;
    if (req.body.website) profileField.website = req.body.website;
    if (req.body.location) profileField.location = req.body.location;
    if (req.body.bio) profileField.bio = req.body.bio;
    if (req.body.status) profileField.status = req.body.status;
    if (req.body.gitHubUserName)
      profileField.gitHubUserName = req.body.gitHubUserName;
    // skills split into array
    if (typeof req.body.skills !== "undefined") {
      profileField.skills = req.body.skills.split(",");
    }

    //social
    profileField.social = {};
    if (req.body.youtube) profileField.social.youtube = req.body.youtube;
    if (req.body.facebook) profileField.social.facebook = req.body.facebook;
    if (req.body.twitter) profileField.social.twitter = req.body.twitter;
    if (req.body.instagram) profileField.social.instagram = req.body.instagram;
    if (req.body.linkedin) profileField.social.linkedin = req.body.linkedin;

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        // update the profile
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileField },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        // create profile

        // check if handle exist
        Profile.findOne({ handle: profileField.handle }).then(profile => {
          if (profile) {
            errors.handle = "that handle already exist";
            res.status(400).json(errors);
          }

          new Profile(profileField).save().then(profile => res.json(profile));
        });
      }
    });
  }
);

//@route POST api/profile/experience
//@desc add experience
//@access private

router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      //add exp to array
      profile.experience.unshift(newExp);

      profile.save().then(profile => res.json(profile));
    });
  }
);

//@route DELETE api/profile/experience/:id
//@desc DELETE experience
//@access private

router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        //Get remove index
        const removeIndex = profile.experience
          .map(item => item.id)
          .indexOf(req.params.exp_id);

        // splice out of array
        profile.experience.splice(removeIndex, 1);

        //save
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);

//@route POST api/profile/education
//@desc add education
//@access private

router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      var newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        filedOfStudy: req.body.filedOfStudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      profile.education.unshift(newEdu);

      profile.save().then(profile => res.json(profile));
    });
  }
);

//@route DELETE api/profile/education/edu_id
//@desc delete education
//@access private

router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        const removeIndex = profile.education
          .map(item => item.id)
          .indexOf(req.params.edu_id);

        profile.education.splice(removeIndex, 1);

        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(400).json(err));
  }
);

//@route DELETE api/profile
//@desc delete profile
//@access private

router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      Users.findByIdAndRemove(req.user.id).then(() =>
        res.json({ success: true })
      );
    });
  }
);

module.exports = router;
