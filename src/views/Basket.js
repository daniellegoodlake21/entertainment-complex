import React, {useEffect, useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";
import $ from 'jquery';
import { useNavigate } from "react-router-dom";
import { saveBooking, loadFromLocalStorage, loadFromDatabase, loadBookings, getTotalPrice} from "../utils/BookingUtils.js";

export default function Basket({token})
{
    const [basketData, setBasketData] = useState();
    const [totalPrice, setTotalPrice] = useState();
    const navigate = useNavigate();

    /* if logged in, save the bookings to the basket or to the confirmed bookings in the database
     if isConfirmed is false it will only add it to the basket, otherwise it will be viewable as a confirmed booking in My Account */
    const saveBookingData = async (isConfirmed, bookings) =>
    {
      let res = await saveBooking(bookings, isConfirmed);
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
      e.preventDefault();
      let bookings = await loadFromDatabase(token);
      let bookingConfirmed = await saveBookingData(true, bookings);
      localStorage.setItem("basket", null);
      if (bookingConfirmed)
      {
        navigate("/my-account");
      }
    }
    
    const loadPage = async () =>
    {
        let bookings = await loadFromLocalStorage(token);
        if (!token)
        {
          if (bookings.all.length > 0)
          {

            $(".login-required-purchase-message").text("Please log in or register to complete your purchase.");
          }
          $(".purchase-btn").attr("disabled", "disabled");
        }
        else
        {
          $(".login-required-purchase-message").text("");
          let success = await saveBookingData(false, bookings.all);
          if (success)
          {
            bookings = await loadFromDatabase(token);
          }
        }
        loadBookings(bookings, setBasketData, setTotalPrice);
        getTotalPrice(bookings.all, setTotalPrice);
    }
    // run on page load
    useEffect(() =>{
      loadPage();
    }, []);
    return (
      <div className="basket-section">
        <h1 className="title text-light central-header">Basket</h1>
        <h5 className="booking-cancellation-status-message text-light central-header"></h5>
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