import express from "express";
import cors from "cors";
import User from "./models/user.js";
import BookableSessionManager from './models/bookable-session-manager.js';
import {config} from 'dotenv';
import jwt from 'jsonwebtoken';
import BookingSnackManager from "./models/booking-snack-manager.js";
import BookingManager from "./models/booking-manager.js";
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
        console.log(err);
        return false;
    }
}

app.post("/login", async (req, res) =>
{
    let email = req.body.confirmedEmail;
    let password = req.body.confirmedPassword;
    let user = new User(email, password);
    let results = await user.login();
    let result = results.result;
    if (result === "success")
    {
        let userId = results.userId;
        let token = jwt.sign({"email" : user.email, "passwordHash" : user.passwordHash}, process.env.TOKEN_KEY);
        res.send({result, token, userId});
    }
    else
    {
        res.send(results);
    }
});

app.post("/register", async (req, res) =>
{
    let email = req.body.confirmedEmail;
    let password = req.body.confirmedPassword;
    let user = new User(email, password);
    let results = await user.register();
    let result = results.result;
    if (result === "success")
    {
        let userId = results.userId;
        let token = jwt.sign({"email" : user.email, "passwordHash" : user.passwordHash}, process.env.TOKEN_KEY);
        res.send({result, token, userId});
    }
    else
    {
        res.send(result);
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
app.get("/bookable-sessions", async (req, res) =>
{
    let activity = req.query.activity;
    let date = req.query.selectedDate;
    if (date === "")
    {
        res.send({result: "dateRequired"});
        return;
    }
    let bookableSessionManager = new BookableSessionManager(activity, date);
    let results = await bookableSessionManager.getBookableSessions();
    res.send(results);
});
// retrieve snacks for bookable sessions. Guests can view snacks for bookable sessions so no need to receive and validate the token
app.get("/bookable-snacks", async (req, res) =>
{
    
    let activity = req.query.activity;
    let snackManager = new BookingSnackManager(activity);
    let results = await snackManager.getSnacks();
    res.send(results);
});

// retrieve snack-booking-link details (snack id, snack name, snack price and quantity) by booking id
app.post("/get-linked-snacks-details", async (req, res) =>
{   
    let userToken = req.body.token;
    let bookingId = req.body.bookingId;
    let userId = req.body.userId;
    if (validateToken(userToken))
    { 
        let snackManager = new BookingSnackManager();
        let results = await snackManager.getLinkedSnacksDetails(bookingId, userId);
        res.send(results);
    }
    else
    {
        res.send({result: "error"});
    }
});

// retrieve snack details only (snack id, snack name and snack price) by snack id
app.get("/get-snack-details-from-id", async (req, res) =>
{
    let snackId = req.query.snackId;
    let snackManager = new BookingSnackManager();
    let results = await snackManager.getSnackDetails(snackId);
    res.send(results);
});
// retrieve booking sessions associated with local storage basket
app.get("/load-associated-booking-session", async (req, res) =>
{
    let sessionId = req.query.sessionId;
    let bookableSessionManager = new BookableSessionManager();
    let results = await bookableSessionManager.getBookableSessionFromBasket(sessionId);
    res.send(results);
});
// retrieve all confirmed bookings data
app.post("/confirmed-bookings", async (req, res) =>
{
    let userToken = req.body.token;
    let userId = req.body.userId;
    if (validateToken(userToken))
    {
        let bookingManager = new BookingManager(userId);
        let results = await bookingManager.getBookings(true);
        res.send(results);
    }
    else
    {
        res.send({result: "error"});
    }
});
// retrieve all relevant bookings-in-basket data
app.post("/bookings", async (req, res) =>
{
    let userToken = req.body.token;
    let userId = req.body.userId;
    if (validateToken(userToken))
    {
        let bookingManager = new BookingManager(userId);
        let results = await bookingManager.getBookings(false);
        res.send(results);
    }
    else
    {
        res.send({result: "error"});
    }
});
// confirm bookable session
app.post("/bookable-sessions", async (req, res) =>
{
    let userToken = req.body.token;
    let userId = req.body.userId;
    if (validateToken(userToken))
    {
        let bookingManager = new BookingManager(userId);
        let results = await bookingManager.confirmBookings();
        res.send(results);
    }
    else
    {
        res.send({result: "error"});
    }
});

// add bookable session to basket
app.post("/bookable-sessions-basket", async (req, res) =>
{
    let userToken = req.body.token;
    let userId = req.body.userId;
    let bookings = req.body.bookings;
    if (validateToken(userToken))
    {
        let bookingManager = new BookingManager(userId);
        let results = await bookingManager.saveBookingsToBasket(bookings);
        res.send(results);
    }
    else
    {
        res.send({result: "error"});
    }
});

// run the server
const PORT = 3001;
app.listen(PORT, () =>
{
    console.log("Server is running.");
});

