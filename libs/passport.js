const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

// call model
const { User } = require("../models");

const autheticate = (email, password, done) => {
    User.findOne({ where: { email: email } }).then(user => {
        if (!user) {
            return done(null, false, { message: 'Incorrect email or password.' });
        }

        bcrypt.compare(password, user.password).then(isMatch => {
            if (!isMatch) {
                return done(null, false, { message: 'Incorrect email or password.' });
            }

            return done(null, user);
        });
    });
};

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, autheticate));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findByPk(id).then(user => {
        done(null, user);
    });
});

module.exports = passport;