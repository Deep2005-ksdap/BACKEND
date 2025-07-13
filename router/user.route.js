const express = require("express");
const userRouter = express.Router();

userRouter.post("/register", (req, res) => {
  console.log("User registration data:", req.method, req.body);
  res.status(200).json({
    message: "Welcome to the User API",
  });
});

module.exports = userRouter;
