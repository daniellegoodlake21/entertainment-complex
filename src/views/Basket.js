import React, {useEffect, useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";
import Booking from "../components/Booking.js";
import $ from 'jquery';
import { useNavigate } from "react-router-dom";
import { SaveBooking } from "../components/BookingUtils.js";

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
// get the snack price, quantity and name from the booking id
const getLinkedSnacksDetails = async (bookingId, token, userId) =>
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
export default function Basket({token})
{
    const [basketData, setBasketData] = useState();
    const [totalPrice, setTotalPrice] = useState();
    const navigate = useNavigate();

    /* if logged in, save the bookings to the basket or to the confirmed bookings in the database
     if isConfirmed is false it will only add it to the basket, otherwise it will be viewable as a confirmed booking in My Account */
    const saveBookingData = async (isConfirmed, bookings) =>
    {
      let res = await SaveBooking(bookings, isConfirmed);
      if (res.result === "success")
      {
        return true;
      }
      else if (isConfirmed)
      {
        if (res.result === "loginRequired")
        {
          $(".login-required-purchase-message").text("You must log in or register to complete your purchase.");
        }
        else if (res.result === "error")
        {
          $(".login-required-purchase-message").text("There was a problem confirming your booking.");
        }   
      }
      else
      {
        if (res.result === "loginRequired")
        {
          $(".login-required-purchase-message").text("You must log in or register to save your basket.");
        }
        else if (res.result === "error")
        {
          $(".login-required-purchase-message").text("There was a problem saving your basket.");
        }  
      }

      return false;
    }

    // when the user confirms the bookings successfully, redirect them to My Account
    const handleSubmit = async (e) =>
    {
      let bookings = await loadBookings();
      let bookingConfirmed = await saveBookingData(true, bookings);
      localStorage.setItem("basket", null);
      if (bookingConfirmed)
      {
        navigate("/my-account");
      }
    }
    /* if the user is logged out retrieve basket data from local storage */
    const loadFromLocalStorage = async () =>
    {
      let basketString = localStorage.getItem("basket");
      let basketItems = null;
      let bookings = [];
      try
      {
        basketItems = JSON.parse(basketString).items;
        if (basketItems.length === 0)
        {
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
        if (token)
        {
        }
        else
        {
          $(".basket-error-message").text("You have no bookings currently in your basket. If you are logged out and have bookings you have previously placed in your basket, please log in to retrieve them.");
        }
         }
      return bookings;
    }
    // load the bookings
    const loadFromDatabase = async () =>
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
                console.log(bookings[i]);
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
        return bookings;
    }
    // load the bookings in the basket
    const loadBookings = async (bookings) =>
    {
      let i = 0;
      let basketData = bookings.map((booking) => 
      {
        i++;
        return (<Booking key={i} booking={booking}/>);
      });
      setBasketData(basketData);
      getTotalPrice();
      return bookings;
    }
    
    const loadPage = async () =>
    {
        let bookings = await loadFromLocalStorage();
        if (!token)
        {

          $(".login-required-purchase-message").text("Please log in or register to complete your purchase.");
          $(".purchase-btn").attr("disabled", "disabled");
        }
        else
        {
          $(".login-required-purchase-message").text("");
          let success = await saveBookingData(false, bookings);
          if (success)
          {
            bookings = await loadFromDatabase();
          }
        }
        loadBookings(bookings);
    }
    // run on page load
    useEffect(() =>{
      loadPage();
    }, []);
    // get total price
    const getTotalPrice = () =>
    {
      let totalPrice = 0;
      let allItems = $("#basket-items-section").children(".booking-data-item");
      for (let i = 0; i < allItems.length; i++)
      {
        let priceElement = $("#basket-items-section .booking-data-item:nth-child("+String(i+1)+") .booking-data-item-price .price").text();
        let price = Number(priceElement);
        totalPrice += price;
      }
      totalPrice = totalPrice.toFixed(2);
      setTotalPrice(totalPrice);
    }
    return (
      <div className="basket-section">
        <h1 className="title text-light central-header">Basket</h1>

        <h5 className="basket-error-message text-light central-header"></h5>
        <div id="basket-items-section">{basketData}</div>
        <form onSubmit={handleSubmit} className="purchase-form">
          <h4>Total Price: £<span id="total-price">{totalPrice}</span></h4>
          <input type="submit" className="purchase-btn btn btn-lg btn-dark form-control form-control-rounded" value="Confirm Bookings"/>
          <p className="login-required-purchase-message central-header"></p>
        </form>
      </div>
      );
}