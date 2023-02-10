const express = require("express");
const api = require("./api");
const auth = require("./auth");
const router = express.Router();

router.use("/api", api); // localhost:3000/api
router.use("/", auth);

module.exports = router;