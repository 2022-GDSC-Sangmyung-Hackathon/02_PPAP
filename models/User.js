const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  id: {
    type: String,
    // required: [true, "Username is required!"],
    trim: true,
  },
  password: {
    type: String,
    // required: [true, "Password is required!"],
    select: false,
    trim: true,
  },
  nickname: {
    type: String,
    required: true,
    trim: true,
  },
  mbti: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
    trim: true,
  },
  area: {
    type: String,
    trim: true,
  },
  gender: {
    type: String,
    required: true,
    trim: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  updateAt: {
    type: Date,
  },
});

userSchema
  .virtual("passwordConfirmation")
  .get(function () {
    return this._passwordConfirmation;
  })
  .set(function (value) {
    this._passwordConfirmation = value;
  });

userSchema
  .virtual("originalPassword")
  .get(function () {
    return this._originalPassword;
  })
  .set(function (value) {
    this._originalPassword = value;
  });

userSchema
  .virtual("currentPassword")
  .get(function () {
    return this._currentPassword;
  })
  .set(function (value) {
    this._currentPassword = value;
  });

userSchema
  .virtual("newPassword")
  .get(function () {
    return this._newPassword;
  })
  .set(function (value) {
    this._newPassword = value;
  });

var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
var passwordRegexErrorMessage = "Should be minimum 8 characters of alphabet and number combination!";

userSchema.path("password").validate(function (v) {
  var user = this;

  if (user.isNew) {
    if (!user._passwordConfirmation) {
      user.invalidate("passwordConfirmation", "Password Confirmation is required.");
    }

    if (!passwordRegex.test(user.password)) {
      user.invalidate("password", passwordRegexErrorMessage);
    } else if (user.password !== user._passwordConfirmation) {
      user.invalidate("passwordConfirmation", "Password Confirmation does not matched!");
    }
  }

  if (!user.isNew) {
    if (!user.currentPassword) {
      user.invalidate("currentPassword", "Current Password is required!");
    } else if (!bcrypt.compareSync(user.currentPassword, user.originalPassword)) {
      user.invalidate("currentPassword", "Current Password is invalid!");
    }

    if (user.newPassword && !passwordRegex.test(user.newPassword)) {
      user.invalidate("newPassword", passwordRegexErrorMessage);
    } else if (user.newPassword !== user.passwordConfirmation) {
      user.invalidate("passwordConfirmation", "Password Confirmation does not matched!");
    }
  }

  userSchema.pre("save", function (next) {
    var user = this;
    if (!user.isModified("password")) {
      return next();
    } else {
      user.password = bcrypt.hashSync(user.password);
      return next();
    }
  });

  userSchema.methods.authenticate = function (password) {
    var user = this;
    return bcrypt.compareSync(password, user.password);
  };
});

let User = mongoose.model("users", userSchema);
module.exports = User;
