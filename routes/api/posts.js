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

//@route GET api/posts/:post_id
//@desc get post by id
//@access public

router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({ noPostFound: "no post found with that ID" })
    );
});

//@route DELETE api/posts/:post_id
//@desc delete post by id
//@access private

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
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

//@route POST api/posts/like/:id
//@desc like post by id
//@access private

router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: "users alredy liked this post" });
          }

          //add user id to likes array
          post.likes.unshift({ user: req.user.id });

          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postNotFound: "no post found" }));
    });
  }
);

//@route POST api/posts/unlike/:id
//@desc unlike post by id
//@access private

router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ alreadynotliked: "you have not liked this yet" });
          }

          //Get remove index
          const removeIndex = post.likes
            .map(item => item.user.id)
            .indexOf(req.user.id);

          //splice out of array
          post.likes.splice(removeIndex, 1);

          //save
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postNotFound: "no post found" }));
    });
  }
);

//@route POST api/posts/comment/post_:id
//@desc comment post by id
//@access private

router.post(
  "/comment/:post_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    Post.findById(req.params.post_id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };

        post.comments.unshift(newComment);

        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postNotFound: "no post found" }));
  }
);

//@route DELETE api/posts/comment/:post_id/:comment_id
//@desc delete the comment
//@access private

router.delete(
  "/comment/:post_id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.post_id)
      .then(post => {
        // check to see if comment exist
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentNotExist: "comment doesnt exist" });
        }

        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);

        //to remove splice it
        post.comments.splice(removeIndex, 1);

        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postNotFound: "no post found" }));
  }
);

module.exports = router;
