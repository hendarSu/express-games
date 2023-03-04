const express = require("express");
const dashbordController = require("../controllers/dashbordController");
const checkToken = require("../middlewares/checkToken");


const dashboard = express.Router();

dashboard.get("/", checkToken, dashbordController.getDashboard)

module.exports = dashboard;