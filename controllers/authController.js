const passport = require("passport");

module.exports = {
    index: (req, res, next) => {
        if (req.isAuthenticated()) {
            res.redirect("/");
        };

        res.render("login", { page: { title: "Halaman Login!" }, user: null })
    },
    login: passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true
    }),
    logout: (req, res, next) => {
        req.logout((err) => {
            if (err) { return next(err); }
            res.redirect('/');
        })
    }
}