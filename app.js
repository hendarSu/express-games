const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

app.get("/", (req, res) => {
    res.send("Server up!");
})

app.listen(port, () => {
    console.log(`Server up on server ${port}!`);
});