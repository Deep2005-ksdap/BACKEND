const express = require("express");
// local module
const homeController = require("../controller/home.controller");
const { checkUserMiddleware, userCheck } = require("../service/home.service");

const homeRouter = express.Router();

homeRouter.get(
  "/dashboard",
  checkUserMiddleware,
  userCheck,
  homeController.getDashboard
);
homeRouter.post(
  "/add-item",
  checkUserMiddleware,
  userCheck,
  homeController.postStock
);
homeRouter.delete(
  "/delete-item/:id",
  checkUserMiddleware,
  userCheck,
  homeController.deleteStock
);
homeRouter.patch(
  "/edit-item/:stockId",
  checkUserMiddleware,
  userCheck,
  homeController.editStock
);

module.exports = homeRouter;
