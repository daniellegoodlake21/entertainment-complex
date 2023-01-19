import express from "express";
import cors from "cors";
import User from "./models/user.js";
import {config} from 'dotenv';
config();

const app = express();

const corsOptions = {"origin" : "http://localhost:3001"}
app.use(cors(corsOptions));

app.use(express.static(".."));
app.use(express.urlencoded({extended: true}));
app.use(express.json());


app.post("/login", async (req, res) =>
{
    console.log(req.body);
    let email = req.body.confirmedEmail;
    let password = req.body.confirmedPassword;
    let user = new User(email, password);
    let result = await user.login();
    if (result === "success")
    {
        res.send({"result" : result, "token": process.env.REACT_APP_TOKEN});
    }
    else
    {
        res.send({"result" : result});
    }
});

app.post("/register", async (req, res) =>
{
    let email = req.body.email;
    let password = req.body.password;
    let user = new User(email, password);
    let result = await user.register();
    res.send({"result" : result, "token": process.env.REACT_APP_TOKEN});
})

const PORT = 3000;
app.listen(PORT, () =>
{
    console.log("Server is running.");
});

