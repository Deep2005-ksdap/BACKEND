const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
    },
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },
});

exports.comparePassword = (password, hash) => {
  return bcrypt.compare(password, hash)
    .then((isMatch) => {
      return isMatch;
    })
    .catch((err) => {
      console.error("Error comparing password:", err);
      throw err;
    });
};

exports.passwordHashing = async (user) => {
  const hashPass = await bcrypt.hash(user.password, 12);
  user.password = hashPass;
  await user.save();
  return user;
};

exports.User = mongoose.model("user", userSchema);
