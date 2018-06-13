const express = require("express");
const router = express.Router();

// here the route will start from /api/users/test /api/users came from server.js
router.get("/test", (req, res) => res.json({ msg: "profile works" }));

//@route GET api/users/register
//@desc Register user
//@access public

module.exports = router;
