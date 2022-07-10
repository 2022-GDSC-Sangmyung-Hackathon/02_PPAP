var express = require("express");
var router = express.Router();
var Post = require("../models/Post");

// Index
router.get("/", function (req, res) {
  res.render("posts/community.ejs");
  // Post.find({})
  //   .sort("-createdAt")
  //   .exec(function (err, posts) {
  //     if (err) return res.json(err);
  //     // res.json(posts);
  //     res.render("posts/select_board.ejs", { posts: posts });
  //   });
});

router.get("/board", async (req, res) => {
  let list = await Post.find();
  console.log(list);
  let views = [0, 0, 0, 0, 0, 1, 0, 2];
  return res.status(200).render("posts/board.ejs", { list: list, views: views });
});

router.get("/ForumSub", async (req, res) => {
  let list = await Post.find();
  console.log(list);
  let views = [147, 156, 93, 85, 75, 125];
  res.render("posts/ForumSub.ejs", { list: list, views: views });
});

router.post("/ForumSub", async (req, res) => {
  let new_posts = new Post({
    writer: req.body.writer,
    title: req.body.title,
    content: req.body.content,
  });

  try {
    await new_posts.save();
    return res.status(200).redirect("/posts/board");
  } catch (e) {
    console.error(e);
  }
});

module.exports = router;
