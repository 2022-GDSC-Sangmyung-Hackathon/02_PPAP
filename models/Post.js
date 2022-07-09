const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  createAt: {
    type: Date,
    default: Date.now,
  },
});
