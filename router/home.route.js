const express = require("express");
// local module
const homeController = require("../controller/home.controller");

const homeRouter = express.Router();

homeRouter.get("/", homeController.getHome);
homeRouter.get("/dashboard", homeController.getDashboard);
homeRouter.post("/add-item", homeController.postStock);
homeRouter.post("/delete-item/:id", homeController.deleteStock);
homeRouter.patch("/edit-item/:itemName", homeController.editStock);

module.exports = homeRouter;
