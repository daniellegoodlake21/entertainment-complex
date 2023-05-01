import React, {useState, useEffect} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";
import Booking from "../components/Booking.js";
import $ from "jquery";
import { handleDatabaseBookings } from "../utils/BookingUtils.js";
const retrieveConfirmedBookings = async (token, userId) =>
{
  return fetch("http://localhost:3001/confirmed-bookings",
  {
      method: "POST",
      headers:
      {
      "Content-Type": "application/json"
      },
      body: JSON.stringify({token, userId})
  }).catch((err) => console.log(err)).then(data => ({status: data.ok, body: data.json()}));
} 

export default function MyAccount()
{

  const [bookingData, setBookingData] = useState();
  // load confirmed bookings
  const loadPage = async () =>
  {
    let bookings = [];
    let token = localStorage.getItem("token");
    let userId = localStorage.getItem("userId");
    let res = await retrieveConfirmedBookings(token, userId);
    if (res.status)
    {
      let body = await res.body;
      $(".confirmed-bookings-message").text("");
      if (body.bookings.length > 0)
      {
        // retrieve the associated snack data and price for each booking
        bookings = body.bookings;
        bookings = await handleDatabaseBookings(bookings, token, true);
        // map the data to Booking components
        let i = 0;
        bookings = bookings.map(booking => 
        {
          i++;
          return (<Booking key={i} index={i} booking={booking} setBookingData={setBookingData} token={token}/>);
        });
      }
      
      setBookingData(bookings);
    }
  }
  // run on page load
  useEffect(() =>{
    loadPage();
  }, []);
  return (<div className="confirmed-bookings-section">
        <h1 className="title text-light central-header">My Bookings</h1>
        <h5 className="booking-cancellation-status-message text-light central-header"></h5>
        <h4 className="confirmed-bookings-message text-light central-header"></h4>
        <div id="confirmed-bookings">{bookingData}</div>
    </div>);
}