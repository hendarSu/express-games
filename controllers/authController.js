const passport = require("passport");
const base_response = require("../libs/base-response");
const { User } = require("./../models");

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
    },
    registration: async (req, res, next) => {
        const { email, password, confirmationPassword } = req.body;

        if (password !== confirmationPassword) {
            res.status(400).json(base_response(null, "failed", "Password konfirmasi tidak sesuai!"));
        }

        try {
            const user = await User.registration({ email, password });
            res.status(200).json(base_response(user, "success", "Registrasi Berhasil!"));
        } catch (error) {
            res.status(400).json(base_response(null, "failed", error));
        }
    },
    loginToken: async (req, res, next) => {
        const { email, password } = req.body;   
        User.authenticateToken({ email, password }).then(async (user) => {
            const data = {
                id: user.id,
                username: user.email,
                accessToken: await User.generateTokenV2({ id: user.id, email: user.email })
            }
            res.status(200).json(base_response(data, "success", "Login Berhasil!"));
        })
    }
}