const mongoose = require("mongoose");

const onlinedbSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  mbti: {
    type: String,
    required: true,
  },
});
