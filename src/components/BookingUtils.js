import $ from "jquery";
import Booking from "./Booking.js";
/* Shared methods for managing bookings */


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
  }).catch((err) => console.log(err)).then(data => data.json());
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
  }).catch((err) => console.log(err)).then(data => data.json());
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
  }).catch((err) => console.log(err)).then(data =>data.json());
} 

// get bookable sessions for an activity for a specific date
export async function GetBookableSessions(activity, selectedDate)
{ 
    if (selectedDate === "")
    {
        return {"result" : "success", "sessions" : []};
    }
    return fetch("http://localhost:3001/bookable-sessions?activity=" + activity +"&selectedDate=" + selectedDate,
    {
        method: "GET",
        headers:
        {
        "Content-Type": "application/json"
        },
    }).catch((err) => console.log(err)).then(data => data.json());
}

// get snacks for activity
export async function GetSnacks(activity)
{
    return fetch("http://localhost:3001/bookable-snacks?activity=" + activity,
    {
        method: "GET",
        headers:
        {
        "Content-Type": "application/json"
        },
    }).catch((err) => console.log(err)).then(data => data.json());
}
// update total price
export function UpdateTotalPrice()
{
    let basicsPrice = Number($("#basic-package-price").text());
    let extrasPrice = Number($("#booking-extras-price").text());
    let totalPrice = (basicsPrice + extrasPrice).toFixed(2);
    $("#total-price").text(totalPrice);
}

// validate user input, call LoginOrRegister, and then add basket item to localStorage if the input is valid
export async function AddToBasket(e, activity, {setBasket}, {navigate})
{
    e.preventDefault();
    let selectedSession = $(".booking-time-slot-outer.selected");
    if (selectedSession.length == 0)
    {
        // set invalid booking message - no time slot selected
        $(".invalid-booking-message").text("Invalid input. Please select a time slot.");

    }
    else if (selectedSession.hasClass("invalid-input"))
    {
        // set invalid booking message - too many attendees
        $(".invalid-booking-message").text("Invalid input. Sorry, but this session does not have enough slots left for the number of people in your group. Please try a different session.");
    }
    else
    {
        // clear invalid booking message
        $(".invalid-booking-message").text("");
        // get user input for basic booking details. The date is included in the bookable session so only the number of adults and children are needed.
        let sessionId = selectedSession.attr("id");
        let adults = $("#" + sessionId).find(".number-of-adults option:selected").first().val();
        let children = $("#" + sessionId).find(".number-of-children option:selected").first().val();
        // get user input for snacks
        let snackElements = $("#snacks-list").children().children();
        let snackData = [];
        for (let i = 0; i < snackElements.length; i++)
        {
            let snackElement = $("#snacks-list .snack-item:nth-child("+String(i+1)+")")[0];
            console.log(snackElement);
            let quantity = $("#snacks-list .snack-item:nth-child("+String(i+1)+") option:selected").val();
            let id = $("#snacks-list .snack-item:nth-child("+String(i+1)+")").attr("id").replace("snack", "");
            if (quantity > 0)
            {
                let snack = {
                    snackId: id,
                    snackQuantity: quantity
                };
                snackData.push(snack);
            }
        }
        // add the booking to the basket
        const basketData = {sessionId, activity, adults, children, snackData};
        setBasket(basketData); /* inside this custom hook's setBasket function, 
        the current basket item (basketData) is APPENDED to the existing ones
        instead of overwriting them, so you can have multiple bookings in your basket at once */
        navigate("/basket");
       
    }
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
  }).catch((err) => console.log(err)).then(data => data.json());
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
            if (res.result === "success")
            {
                $(".basket-error-message").text("");
                let sessionId = res.session.sessionId;
                let time = res.session.time;
                let childPrice = res.session.childPrice;
                let adultPrice = res.session.adultPrice;
                let date = res.session.date;
                let adults = basketItem.adults;
                let children = basketItem.children;
                let activity = basketItem.activity;
                let totalPrice = (childPrice * children) + (adultPrice * adults);
                let snackData = [];
                for (let j = 0; j < basketItem.snackData.length; j++)
                {
                let snackId = basketItem.snackData[j].snackId;
                let result = await getSnackDetailsFromId(snackId);
                if (result.result === "success")
                {
                    let snack = result.snack;
                    snack.snackQuantity = basketItem.snackData[j].snackQuantity;
                    totalPrice += snack.snackPrice * snack.snackQuantity;
                    snackData.push(snack);
                }
                else if (result.result === "error")
                {
                    $(".basket-error-message").text("There was a problem accessing booking extras.");
                }   
                }
                let bookingData = {sessionId, time, childPrice, adultPrice, date, adults, children, activity, snackData, totalPrice};
                bookings.push(bookingData);
            }
        }
    }    
    catch
    {
        $(".purchase-btn").attr("disabled", "disabled");
        if (!token)
        {
            $(".basket-error-message").text("You have no bookings currently in your basket. If you are logged out and have bookings you have previously placed in your basket, please log in to retrieve them.");
        }
    }
    return {all: bookings};
}
 /* load the bookings from the database */
 export async function loadFromDatabase(token)
{
    let bookings = [];
    let userId = localStorage.getItem("userId");
    let res = await retrieveBookingsFromDatabase(token, userId);
    if (res.result === "success")
    {
        bookings = res.bookings;
        if (bookings.length === 0)
        {
            $(".purchase-btn").attr("disabled", "disabled");
            $(".basket-error-message").text("You have no bookings currently in your basket.");
        }
        else
        {
            $(".basket-error-message").text("");
            $(".purchase-btn").removeAttr("disabled");
        }
        for (let i = 0; i < bookings.length; i++)
        {
            let bookingId = bookings[i].bookingId;
            bookings[i].totalPrice = (bookings[i].childPrice * bookings[i].children) + (bookings[i].adultPrice * bookings[i].adults);
            let userId = localStorage.getItem("userId");
            let snackData = await getLinkedSnacksDetails(bookingId, token, userId);
            if (snackData.result === "success")
            {
                bookings[i].snackData = snackData.snackData;
                for (let j = 0; j < bookings[i].snackData.length; j++)
                {
                let snackPrice = bookings[i].snackData[j].snackPrice;
                let snackQuantity = bookings[i].snackData[j].snackQuantity;
                bookings[i].totalPrice += snackPrice * snackQuantity;
                }
            }
            else if (snackData.result === "error")
            {
                $(".basket-error-message").text("There was a problem accessing snacks within bookings in you basket.");
            }
            
        }
    }
    else if (res.result === "error")
    {
    $(".basket-error-message").text("There was a problem accessing your basket.");
    }
    return {all: bookings};
}

// get total price of all items in the basket
export async function getTotalPrice(bookings, setTotalPrice)
{
    let totalPrice = 0;
    for (let i = 0; i < bookings.length; i++)
    {
    let booking = bookings[i];
    let subtotal = (booking.adultPrice * booking.adults) + (booking.childPrice * booking.children);
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
export async function loadBookings(bookings, setBasketData)
{
    let i = 0;
    let basketData = bookings.all.map((booking) => 
    {
        i++;
        return (<Booking key={i} index={i} booking={booking} setBookingData={setBasketData}/>);
    });
    setBasketData(basketData);
}

// save the booking either to be displayed in the basket (if isConfirmed = false) or the 'My Account' page's confirmed bookings
export async function SaveBooking(bookings, isConfirmed)
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
    }).catch((err) => console.log(err)).then(data => data.json());      
}