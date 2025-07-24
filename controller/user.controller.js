const userModel = require("../model/user.model");
const { validationResult, check } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.registerUser = [
  check("fullname.firstname")
    .isLength({ min: 3 })
    .withMessage("First name should be at least 3 characters long"),
  check("email").isEmail().withMessage("Invalid email format"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  async (req, res) => {
    try {
      const { fullname, email, password } = req.body;
      const firstname = fullname?.firstname;
      const lastname = fullname?.lastname;

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const existingUser = await userModel.User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          message: "Invalid email or password",
        });
      }
      const newUser = new userModel.User({
        fullname: {
          firstname,
          lastname,
        },
        email,
        password,
      });

      const user = await userModel.passwordHashing(newUser);
      if (user) {
        res.status(200).json({
          message: "User has been Created",
        });
      }
    } catch (error) {
      console.error("Error in Registration:", error);
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },
];

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await userModel.User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      message: "Email or Password is incorrect",
    });
  }

  const isMatch = await userModel.comparePassword(password, user.password);
  if (!isMatch) {
    return res.status(400).json({
      message: "Email or Password is incorrect",
    });
  }

  jwt.sign(
    { userId: user._id, username: user.fullname },
    process.env.JWT_Secret,
    { expiresIn: "1d" },
    (err, token) => {
      if (err) {
        console.error("Error signing JWT:", err);
        return res.status(500).json({
          message: "Internal server error",
          error: err.message,
        });
      }
      res.cookie("token", token, { httpOnly: true });
      return res.status(200).json({
        message: "Login successful",
      });
    }
  );
};

exports.checkAuth = (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ isLoggedIn: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_Secret);
    if (decoded) {
      return res.status(200).json({
        isLoggedIn: true,
      });
    }
  } catch (err) {
    return res.status(401).json({ isLoggedIn: false });
  }
};

exports.logoutUser = (req, res, next) => {
  res.clearCookie("token");
  return res.status(200).json({
    message: "Logout successful",
  });
};
