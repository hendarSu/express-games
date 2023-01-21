const express = require("express");
const router = require("./routes/router");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

app.get("/", (req, res) => {
    res.send("Server up!");
})

app.use("/", router); // localhost:3000/

app.listen(port, () => {
    console.log(`Server up on server ${port}!`);
});