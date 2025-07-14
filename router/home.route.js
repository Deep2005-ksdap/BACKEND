const express = require("express");
// local module
const homeController = require("../controller/home.controller");
const userService = require("../service/user.service");

const homeRouter = express.Router();

homeRouter.get(
  "/dashboard",
  userService.checkUserMiddleware,
  homeController.getDashboard
);
homeRouter.post(
  "/add-item",
  userService.checkUserMiddleware,
  homeController.postStock
);
homeRouter.delete(
  "/delete-item/:id",
  userService.checkUserMiddleware,
  homeController.deleteStock
);
homeRouter.patch(
  "/edit-item/:itemName",
  userService.checkUserMiddleware,
  homeController.editStock
);

module.exports = homeRouter;
