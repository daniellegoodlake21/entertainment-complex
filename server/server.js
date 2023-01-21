import express from "express";
import cors from "cors";
import User from "./models/user.js";
import BookableSessionManager from './models/bookable-session-manager.js';
import {config} from 'dotenv';
import jwt from 'jsonwebtoken';
config();

const app = express();

const corsOptions = {"origin" : "http://localhost:3000"}
app.use(cors(corsOptions));

app.use(express.static(".."));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

function validateToken(token)
{
    if (token == undefined)
    {
        return false;
    }
    try
    {
        const decodedJwt = jwt.verify(token, process.env.TOKEN_KEY);
        return true;
    } 
    catch (err)
    {
        console.log(err.message);
        return false;
    }
}

app.post("/login", async (req, res) =>
{
    console.log(req.body);
    let email = req.data.confirmedEmail;
    let password = req.data.confirmedPassword;
    let user = new User(email, password);
    let result = await user.login();
    if (result === "success")
    {
        let token = jwt.sign({"email" : user.email, "passwordHash" : user.passwordHash}, process.env.TOKEN_KEY);
        res.send({result, token});
    }
    else
    {
        res.send({result});
    }
});

app.post("/register", async (req, res) =>
{
    let email = req.body.confirmedEmail;
    let password = req.body.confirmedPassword;
    let user = new User(email, password);
    let result = await user.register();
    if (result === "success")
    {
        let token = jwt.sign({"email" : user.email, "passwordHash" : user.passwordHash}, process.env.TOKEN_KEY);
        res.send({result, token});
    }
    else
    {
        res.send({result});
    }
})

app.post("/my-account", (req, res) =>
{
    let userToken = req.body.token;
    if (validateToken(userToken))
    {
        res.send({"result": "success"});
    }
    else
    {
        res.send({"result": "loginRequired"});
    }
})

// retrieve bookable sessions. Guests can view bookable sessions so no need to receive and validate the token
app.get("/bookable-session", async (req, res) =>
{
    let activity = req.query.activity;
    let date = req.query.selectedDate;
    if (date === "")
    {
        res.send({"result": "dateRequired"});
        return;
    }
    let bookableSessionManager = new BookableSessionManager(activity, date);
    let results = await bookableSessionManager.getBookableSessions();
    let result = results.result;
    let sessions = results.sessions;
    if (result === "success")
    {
        res.send({result, sessions});
    }
    else
    {
        res.send({result});
    }
    
});


// run the server
const PORT = 3001;
app.listen(PORT, () =>
{
    console.log("Server is running.");
});

