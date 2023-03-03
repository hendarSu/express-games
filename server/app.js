const express = require("express");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');

const router = require("./src/routes/router");
const passport = require("./src/libs/passport");
const passportJwt = require("./src/libs/passport-jwt");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

app.use(cookieParser());
app.use(flash());
app.use(session({
  secret: 'secretkey',
  resave: false,
  saveUninitialized: false
}));

// LocalStrategy
app.use(passport.initialize());
app.use(passport.session());

// JWT
app.use(passportJwt.initialize());

// view engine setup
app.set('view engine', 'ejs');
app.set('views', './server/src/views');

app.use("/", router); // localhost:3000/

app.listen(port, () => {
    console.log(`Server up on server ${port}!`);
});