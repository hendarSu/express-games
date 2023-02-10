const express = require("express");
const api = require("./api");
const router = express.Router();

router.use("/api", api); // localhost:3000/api

module.exports = router;