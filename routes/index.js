var express = require("express");
var router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");
const path = require("path");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("main");
});

router.get("/chat", function (req, res, next) {
  res.sendFile(path.join(__dirname, "..", "views", "chat", "/chatting.html"));
});

router.get("/zoayo", (req, res, next) => {
  const user = User.find({}, (error, user) => {
    res.render("zoayo.ejs", { user: user });
  });
});

router.get("/matching", (req, res, next) => {
  const user = User.find({}, (error, user) => {
    res.render("matching.ejs", { user: user });
  });
});

router.get("/signup", (req, res, next) => {
  res.render("signup.ejs");
});

router.post("/signup", (req, res, next) => {
  try {
    User.create(req.body, (err, user) => {
      if (err) return res.json(err);

      res.redirect("/");
    });
  } catch (error) {
    console.error(error);
  }
});

// router.get("/community", (req, res, next) => {
//   const user = User.find({}, (error, user) => {
//     res.render("community.ejs", { user: user });
//   });
// });

router.get("/community", (req, res, next) => {
  res.render("community.ejs");
});

router.get("/community/:id");

router.get("matching.ejs");
module.exports = router;
