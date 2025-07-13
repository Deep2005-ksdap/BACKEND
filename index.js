const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// local module
const userRouter = require("./router/user.route");
const homeRouter = require("./router/home.route");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRouter);
app.use("/home", homeRouter);

const PORT = 3002;

mongoose
  .connect(
    "mongodb+srv://DeepAayup:11banarsi@myDataBase.qzunk41.mongodb.net/inventoryTrackor?retryWrites=true&w=majority&appName=airbnbClone"
  )
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });
