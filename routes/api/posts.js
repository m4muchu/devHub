const express = require("express");
const router = express.Router();
const moongose = require("mongoose");
const passport = require("passport");

//load the models

const Post = require("../../models/Post");
const Profile = require("../../models/Profile");

// load validation
const validatePostInput = require("../../validation/post");

// here the route will start from /api/users/test /api/users came from server.js
router.get("/test", (req, res) => res.json({ msg: "post works" }));

//@route POST api/posts
//@desc add post
//@access private

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name, // here the name and avatar will loaded from redux
      avatar: req.body.avatar,
      user: req.user.id
    });

    newPost.save().then(post => res.json(post));
  }
);

//@route GET api/posts
//@desc get posts
//@access public

router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 }) // moongose operator for sorting on the basis of date
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ noPostsFound: "no posts found" }));
});

//@route GET api/posts/:id
//@desc get post by id
//@access public

router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({ noPostFound: "no post found with that ID" })
    );
});

//@route DELETE api/posts/:id
//@desc delete post by id
//@access private

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(Profile => {
      Post.findById(req.params.id)
        .then(post => {
          //check for post owner
          if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ unAuthorise: "user not Authorised" });
          }
          //delete post
          post.remove().then(() => res.json({ success: true }));
        })
        .catch(err => res.status(404).json({ postNotFound: "no post found" }));
    });
  }
);

module.exports = router;
