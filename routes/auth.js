const express = require("express");
const auth = express();

auth.get("/login", (req, res, next) => {
    res.render("login");
});

auth.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

auth.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/');
    })
})

module.exports = auth;