const express = require("express");
const router = require("./routes/router");

const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const passport = require("passport");

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
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
    res.send("Server up!");
})

app.set('view engine', 'ejs');

app.use("/", router); // localhost:3000/

app.listen(port, () => {
    console.log(`Server up on server ${port}!`);
});