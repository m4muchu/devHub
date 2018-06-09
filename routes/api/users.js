const express = require("express");
const router = express.Router();

// here the route will start from /api/users/test /api/users came from server.js
router.get("/test", (req, res) => res.json({ msg: "users works" }));

module.exports = router;
