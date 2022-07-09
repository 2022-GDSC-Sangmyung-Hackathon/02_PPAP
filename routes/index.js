var express = require("express");
var router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");

const user1 = new User({
  id: "test",
  password: "dsadsa",
  nickname: "hello",
  mbti: "INTP",
  age: 32,
});

const user2 = new User({
  id: "test",
  password: "dsadsa",
  nickname: "hello",
  mbti: "INTP",
  age: 32,
});

const user3 = new User({
  id: "test",
  password: "dsadsa",
  nickname: "hello",
  mbti: "INTP",
  age: 32,
});

const user4 = new User({
  id: "test",
  password: "dsadsa",
  nickname: "hello",
  mbti: "INTP",
  age: 32,
});

const user5 = new User({
  id: "test",
  password: "dsadsa",
  nickname: "hello",
  mbti: "INTP",
  age: 32,
});

/* GET home page. */
router.get("/", function (req, res, next) {
  User.create(user1, function (err, user) {});
  res.render("main", { title: "Express" });
});

router.get("/chat2", function (req, res, next) {
  res.render("chat/chat2.ejs");
});

router.get("/zoayo", (req, res, next) => {
  res.render("zoayo.ejs");
});

router.get("/matching", (req, res, next) => {
  res.render("matching.ejs");
});

router.get("/signup", (req, res, next) => {
  res.render("signup.ejs");
});

router.get("matching.ejs");
module.exports = router;
