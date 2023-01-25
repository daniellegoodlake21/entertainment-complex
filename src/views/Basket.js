import React, {Component, useEffect, useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";
import Booking from "../components/Booking.js";
import $ from 'jquery';

const loadBookingSessionDataAssociatedWithBooking = async (sessionId) =>
{
  return fetch('http://localhost:3001/load-associated-booking-session?sessionId='+sessionId,
  {
      method: "GET",
      headers:
      {
      'Content-Type': 'application/json'
      },
  }).catch((err) => console.log(err)).then(data => data.json());
}
async function getSnackDetailsFromId(snackId)
{
  return fetch('http://localhost:3001/get-snack-details-from-id?snackId='+snackId,
  {
      method: "GET",
      headers:
      {
      'Content-Type': 'application/json'
      },
  }).catch((err) => console.log(err)).then(data => data.json());
}

export default function Basket()
{
    const [basketData, setBasketData] = useState();
  
    
    // load the bookings in the basket
    const LoadBookings = async () =>
    {
      let basketString = localStorage.getItem("basket");
      let basketItems = null;
      try
      {
        basketItems = JSON.parse(basketString).items;
      }
      catch
      {
        $(".basket-error-message").text("There are no bookings currently in your basket.");
        return;
      }
      let bookings = [];
      for (let i = 0; i < basketItems.length; i++)
      {
        let basketItem = basketItems[i];
        let res = await loadBookingSessionDataAssociatedWithBooking(basketItem.sessionId);
        if (res.result === "success")
        {
          $(".basket-error-message").text("Success! (Test)");
          let sessionId = res.session.sessionId;
          let time = res.session.time;
          let childPrice = res.session.childPrice;
          let adultPrice = res.session.adultPrice;
          let date = res.session.basketItem;
          let adults = basketItem.adults;
          let children = basketItem.children;
          let activity = basketItem.activity;
          let snacks = [];
          let bookingData = {sessionId, time, childPrice, adultPrice, date, adults, children, activity, snacks};
          bookings.push(bookingData);        
      
        }
        else if (res.result === "error")
        {
          $(".basket-error-message").text("There was a problem (no matching session) accessing your basket. It has now been reset.");
          localStorage.setItem("basket", {"items":[]});
        }
      }
      let j = 0;
      let basketData = bookings.map((booking) => 
        {
          j++;
          return (<Booking key={booking.sessionId*j} booking={booking}/>);
        });
      setBasketData(basketData);
    } 
    useEffect(() =>
    {
      LoadBookings();
    }, []);
    return (
      <div className="basket-section">
         <h1 className="title text-light central-header">Basket</h1>
         <h4 className="text-light central-header">Please log in or register to checkout.</h4>
         <h5 className="basket-error-message text-light central-header"></h5>
         <div id="basket-items-section">{basketData}</div>
      </div>
      );
}