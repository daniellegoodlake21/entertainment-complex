const express = require("express");
const cors = require("cors");

const app = express();

var corsOptions = {
    origin: "http://localhost:3001"
}
app.use(cors(corsOptions));

app.get("/", (req, res) =>
{
});