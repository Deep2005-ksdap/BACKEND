const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  fullname: {
    fullname: {
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

exports.passwordHashing = async (user) => {
  const hashPass = await bcrypt.hash(user.password, 10);
  user.password = hashPass;
  await user.save();
  return user;
}


exports.User = mongoose.model("user", userSchema);
