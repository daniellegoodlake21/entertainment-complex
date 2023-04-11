import express from "express";
import cors from "cors";
import User from "./models/user.js";
import BookableSessionManager from './models/bookable-session-manager.js';
import {config} from 'dotenv';
import jwt from 'jsonwebtoken';
import BookingSnackManager from "./models/booking-snack-manager.js";
import BookingManager from "./models/booking-manager.js";
import SeatingManager from "./models/seating-manager.js";
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
        res.status(200).send({result, token, userId});
    }
    else if (result === "error")
    {
        res.status(500).send({});
    }
    else
    {
        res.status(200).send({result});
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
        res.status(200).send({result, token, userId});
    }
    else
    {
        res.status(200).send({result});
    }
})

app.post("/my-account", (req, res) =>
{
    let userToken = req.body.token;
    if (validateToken(userToken))
    {
        res.status(200).send({});
    }
    else
    {
        res.status(401).send({});
    }
})

// retrieve bookable sessions. Guests can view bookable sessions so no need to receive and validate the token
app.get("/bookable-sessions", async (req, res) =>
{
    let activity = req.query.activity;
    let date = req.query.selectedDate;
    if (date === "")
    {
        res.status(200).send({result: "dateRequired"});
        return;
    }
    let bookableSessionManager = new BookableSessionManager(activity, date);
    let results = await bookableSessionManager.getBookableSessions();
    let result = results.result;
    if (result === "success")
    {
        let sessions = results.sessions;
        res.status(200).send({result, sessions});        
    }
    else
    {
        res.status(500).send({});
    }

});
// retrieve snacks for bookable sessions. Guests can view snacks for bookable sessions so no need to receive and validate the token
app.get("/bookable-snacks", async (req, res) =>
{
    let activity = req.query.activity;
    let snackManager = new BookingSnackManager(activity);
    let results = await snackManager.getSnacks();
    if (results.result === "success")
    {
        let snacks = results.snacks;
        res.status(200).send({snacks});        
    }
    else
    {
        res.status(500).send({});
    }

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
        if (results.result === "success")
        {
            let snackData = results.snackData;
            res.status(200).send({snackData});
        }
        else
        {
            res.status(500).send({});
        }
    }
    else
    {
        res.status(401).send({});
    }
});

// retrieve snack details only (snack id, snack name and snack price) by snack id
app.get("/get-snack-details-from-id", async (req, res) =>
{
    let snackId = req.query.snackId;
    let snackManager = new BookingSnackManager();
    let results = await snackManager.getSnackDetails(snackId);
    if (results.result === "success")
    {
        let snack = results.snack;
        res.status(200).send({snack});
    }
    else
    {
        res.status(500).send({});
    }
});
// retrieve booking sessions associated with local storage basket
app.get("/load-associated-booking-session", async (req, res) =>
{
    let sessionId = req.query.sessionId;
    let bookableSessionManager = new BookableSessionManager();
    let results = await bookableSessionManager.getBookableSessionFromBasket(sessionId);
    if (results.result === "success")
    {
        let session = results.session;
        res.status(200).send({session});
    }
    else
    {
        res.status(500).send({});
    }
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
        if (results.result === "success")
        {
            let bookings = results.bookings;
            res.status(200).send({bookings});
        }
        else
        {
            res.status(500).send({});
        }
    }
    else
    {
        res.status(401).send({});
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
        if (results.result === "success")
        {
            let bookings = results.bookings;
            res.status(200).send({bookings});
        }
        else
        {
            res.status(500).send({});
        }
    }
    else
    {
        res.status(401).send({});
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
        let result = results.result;
        if (result === "success")
        {
            res.status(200).send({result});
        }
        else
        {
            res.status(500).send({});
        }
    }
    else
    {
        res.status(401).send({});
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
        if (results.result === "success")
        {
            res.status(200).send({});
        }
        else
        {
            res.status(500).send({});
        }
    }
    else
    {
        res.status(401).send({});
    }
});

// cancel a booking, it can be either in-basket or confirmed
app.post("/cancel-booking", async (req, res) =>
{
    let userToken = req.body.token;
    let userId = req.body.userId;
    let bookingId = req.body.bookingId;
    if (validateToken(userToken))
    {
        if (validateToken(userToken))
        {
            let bookingManager = new BookingManager(userId);
            let results = await bookingManager.deleteBooking(bookingId);
            if (results.result === "success")
            {
                res.status(200).send({});
            }
            else
            {
                res.status(500).send({});
            }
        }
        else
        {
            res.status(401).send({});
        }
    }
});

// retrieve seat data for the cinema
app.get("/get-cinema-seat-data", async (req, res) =>
{
    let seatingManager = new SeatingManager("cinema");
    let bookableSession = req.query.sessionId; // this can be null if no film or show has been selected yet, in  which case all seats will be displayed as available until one is selected
    let results = await seatingManager.getSeats(bookableSession);
    let result = results.result;
    if (result === "success")
    {
        let seats = results.seats;
        res.status(200).send({seats});
    }
    else
    {
        res.status(500).send({});
    }
});

// run the server
const PORT = 3001;
app.listen(PORT, () =>
{
    console.log("Server is running.");
});

