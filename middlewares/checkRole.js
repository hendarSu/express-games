const checkRole = (role) => {
    return function (req, res, next) {
        if (req.isAuthenticated() && req.user.role === role) {
            return next();
        }
        res.redirect('/login');
    }
}

module.exports = checkRole;