const express = require("express");
const api = require("./api");
const auth = require("./auth");
const home = require("./home");
const router = express.Router();

router.get("/", (req, res, next) => {
    res.render("home", { page: { title: "Halaman beranda!" }, user: req.isAuthenticated ? req.user: null })
});

router.use("/", auth);
router.use("/", home);

router.use("/api", api); // localhost:3000/api

module.exports = router;