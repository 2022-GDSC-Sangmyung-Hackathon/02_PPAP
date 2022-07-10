var mongoose = require("mongoose");

var postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  writer: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updateAt: { type: Date },
});

var Post = mongoose.model("post", postSchema);
module.exports = Post;
