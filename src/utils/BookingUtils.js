import $ from "jquery";
import Booking from "../components/Booking.js";
/* Shared methods for managing bookings */

const CINEMA_PREMIUM_SEAT_ADDITIONAL_COST = 2;
export default CINEMA_PREMIUM_SEAT_ADDITIONAL_COST;
// save the booking either to be displayed in the basket (if isConfirmed = false) or the 'My Account' page's confirmed bookings
export async function saveBooking(bookings, isConfirmed)
{
    let url = "http://localhost:3001/bookable-sessions";
    if (!isConfirmed)
    {
        url = "http://localhost:3001/bookable-sessions-basket";
    }
    let token = localStorage.getItem("token");
    let userId = localStorage.getItem("userId");
    return fetch(url,
    {
        method: "POST",
        headers:
        {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({bookings, isConfirmed, token, userId})
    }).catch((err) => console.log(err)).then(data => ({status: data.ok, body: data.json()}));      
}

// get the data which is the same for all users for each session (e.g., the date, time, cost per adult and cost per child etc)
const loadBookingSessionDataAssociatedWithBooking = async (sessionId) =>
{
  return fetch("http://localhost:3001/load-associated-booking-session?sessionId="+sessionId,
  {
      method: "GET",
      headers:
      {
      "Content-Type": "application/json"
      },
  }).catch((err) => console.log(err)).then(data => ({status: data.ok, body: data.json()}));
}
// get the snack price and snack name from the id only
const getSnackDetailsFromId = async (snackId) =>
{
  return fetch("http://localhost:3001/get-snack-details-from-id?snackId=" + snackId,
  {
      method: "GET",
      headers:
      {
      "Content-Type": "application/json"
      },
  }).catch((err) => console.log(err)).then(data => ({status: data.ok, body: data.json()}));
}
/* if the local storage's basket does not exist, the user may have previously saved basket data from when
they were last logged in, so retrieve that */
const retrieveBookingsFromDatabase = async (token, userId) =>
{
  return fetch("http://localhost:3001/bookings",
  {
      method: "POST",
      headers:
      {
      "Content-Type": "application/json"
      },
      body: JSON.stringify({token, userId})
  }).catch((err) => console.log(err)).then(data => ({status: data.ok, body: data.json()}));
} 

// get the snack price, quantity and name from the booking id
export async function getLinkedSnacksDetails(bookingId, token, userId)
{ 
  return fetch("http://localhost:3001/get-linked-snacks-details",
  {
      method: "POST",
      headers:
      {
      "Content-Type": "application/json"
      },
      body: JSON.stringify({bookingId, token, userId})
  }).catch((err) => console.log(err)).then(data => ({status: data.ok, body: data.json()}));
}


 /* if the user is logged out retrieve basket data from local storage */
export async function loadFromLocalStorage(token)
{
    let basketString = localStorage.getItem("basket");
    let basketItems = null;
    let bookings = [];
    try
    {
        basketItems = JSON.parse(basketString).items;
        if (basketItems.length === 0)
        {
            $(".basket-error-message").text("You have no bookings currently in your basket. If you are logged out and have bookings you have previously placed in your basket, please log in to retrieve them.");
            $(".purchase-btn").attr("disabled", "disabled");
        }
        for (let i = 0; i < basketItems.length; i++)
        {
            let basketItem = basketItems[i];
            let res = await loadBookingSessionDataAssociatedWithBooking(basketItem.sessionId);
            if (res.status)
            {
                let body = await res.body;
                let session = body.session;
                $(".basket-error-message").text("");
                let sessionId = session.sessionId;
                let time = session.time;
                let childPrice = session.childPrice;
                let adultPrice = session.adultPrice;
                let date = session.date;
                let adults = basketItem.adults;
                let children = basketItem.children;
                let activity = basketItem.activity;
                let additionalDetails = basketItem.additionalDetails;
                let totalPrice = (childPrice * children) + (adultPrice * adults);
                if (activity === "bowling")
                {
                    totalPrice = totalPrice * additionalDetails.games;
                }
                if (activity === "cinema")
                {
                    totalPrice += additionalDetails.premiumSeatCount * CINEMA_PREMIUM_SEAT_ADDITIONAL_COST;
                }
                let snackData = [];
                for (let j = 0; j < basketItem.snackData.length; j++)
                {
                    let snackId = basketItem.snackData[j].snackId;
                    let result = await getSnackDetailsFromId(snackId);
                    if (result.status)
                    {
                        let body = await result.body;
                        let snack = body.snack;
                        snack.snackQuantity = basketItem.snackData[j].snackQuantity;
                        totalPrice += snack.snackPrice * snack.snackQuantity;
                        snackData.push(snack);
                    }
                    else
                    {
                        $(".basket-error-message").text("There was a problem accessing booking extras.");
                    }   
                }
                let bookingData = {sessionId, time, childPrice, adultPrice, date, adults, children, activity, snackData, totalPrice, additionalDetails};
                bookings.push(bookingData);
            }
        }
    }    
    catch (err)
    {
        $(".purchase-btn").attr("disabled", "disabled");
        if (!token)
        {
            $(".basket-error-message").text("You have no bookings currently in your basket. If you are logged out and have bookings you have previously placed in your basket, please log in to retrieve them.");
        }
    }
    return bookings;
}
// handle  details once basic booking information is retrieved from database
export async function handleDatabaseBookings(bookings, token, confirmed)
{
    if (bookings.length === 0)
    {
        $(".purchase-btn").attr("disabled", "disabled");
        if (confirmed)
        {
            $(".confirmed-bookings-message").text("You currently have no confirmed bookings.");
        }
        else
        {
            $(".basket-error-message").text("You have no bookings currently in your basket.");
        }
    }
    else
    {
        if (confirmed)
        {
            $(".confirmed-bookings-message").text("");
        }
        else
        {
            $(".basket-error-message").text("");
            $(".purchase-btn").removeAttr("disabled");        
        }

    }
    for (let i = 0; i < bookings.length; i++)
    {
        let bookingId = bookings[i].bookingId;
        bookings[i].totalPrice = (bookings[i].childPrice * bookings[i].children) + (bookings[i].adultPrice * bookings[i].adults);
        let userId = localStorage.getItem("userId");
        // modify total price if necessary depending on the booking type
        if (bookings[i].activity === "bowling")
        {
            bookings[i].totalPrice = bookings[i].totalPrice * bookings[i].additionalDetails.games;
        }
        else if (bookings[i].activity === "cinema")
        {
            bookings[i].totalPrice += bookings[i].additionalDetails.premiumSeatCount * CINEMA_PREMIUM_SEAT_ADDITIONAL_COST;
        }
        // get snack data and add to total price
        let snackData = await getLinkedSnacksDetails(bookingId, token, userId);
        if (snackData.status)
        {
            snackData = await snackData.body;
            bookings[i].snackData = snackData.snackData;
            for (let j = 0; j < bookings[i].snackData.length; j++)
            {
                let snackPrice = bookings[i].snackData[j].snackPrice;
                let snackQuantity = bookings[i].snackData[j].snackQuantity;
                bookings[i].totalPrice += snackPrice * snackQuantity;
            }
        }
        else
        {
            if (confirmed)
            {
                $(".confirmed-bookings-message").text("There was a problem retrieving your confirmed bookings.");
            }
            else
            {
                $(".basket-error-message").text("There was a problem accessing snacks within bookings in your basket.");
            }
        }

    }  
    return bookings;
}
/* load the bookings from the database */
export async function loadFromDatabase(token)
{
    let bookings = [];
    let userId = localStorage.getItem("userId");
    let res = await retrieveBookingsFromDatabase(token, userId);
    if (res.status)
    {
        let body = await res.body;
        bookings = body.bookings;
        bookings = await handleDatabaseBookings(bookings, token, false);
    }
    else
    {
        $(".basket-error-message").text("There was a problem accessing your basket.");
    }
    return bookings;
}

// get total price of all items in the basket
export async function getTotalPrice(bookings, setTotalPrice)
{
    let totalPrice = 0;
    for (let i = 0; i < bookings.length; i++)
    {
        let booking = bookings[i];
        let subtotal = (booking.adultPrice * booking.adults) + (booking.childPrice * booking.children);
        if (booking.activity === "bowling")
        {
            subtotal = subtotal * booking.additionalDetails.games;
        }
        if (booking.activity === "cinema")
        {
            subtotal += booking.additionalDetails.premiumSeatCount * CINEMA_PREMIUM_SEAT_ADDITIONAL_COST;
        }
        for (let j = 0; j < booking.snackData.length; j++)
        {
            let snackPrice = booking.snackData[j].snackPrice;
            let snackQuantity = booking.snackData[j].snackQuantity;
            subtotal += snackPrice * snackQuantity;
        }
        totalPrice += subtotal;
    }
    totalPrice = totalPrice.toFixed(2);
    setTotalPrice(totalPrice);
}
// load the bookings in the basket
export function loadBookings(bookings, setBasketData, setTotalPrice)
{
    let i = 0;
    let basketData = bookings.map(booking => 
    {
        i++;
        return (<Booking key={i} index={i} booking={booking} setBookingData={setBasketData} setTotalPrice={setTotalPrice}/>);
    });
    setBasketData(basketData);
}