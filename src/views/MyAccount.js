import React, {useState, useEffect} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";
import Booking from "../components/Booking.js";
import $ from "jquery";
import { getLinkedSnacksDetails } from "../components/BookingUtils.js";
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
  }).catch((err) => console.log(err)).then(data =>data.json());
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
    if (res.result === "success")
    {
      $(".confirmed-bookings-message").text("");
      if (res.bookings.length > 0)
      {
        // retrieve the associated snack data and price for each booking
        bookings = res.bookings;
        for (let i = 0; i < bookings.length; i++)
        {
          let booking = bookings[i];
          let totalPrice = (booking.childPrice * booking.children) + (booking.adultPrice * booking.adults);
          // snack data
          let bookingId = booking.bookingId;
          let snackData = await getLinkedSnacksDetails(bookingId, token, userId);
          if (snackData.result === "success")
          {
            bookings[i].snackData = snackData.snackData;
            for (let j = 0; j < booking.snackData.length; j++)
            {
              let snackPrice = booking.snackData[j].snackPrice;
              let snackQuantity = booking.snackData[j].snackQuantity;
              totalPrice += snackPrice * snackQuantity;
            }
            bookings[i].totalPrice = totalPrice;
          }
          else
          {
            $(".confirmed-bookings-message").text("There was a problem retrieving snacks within your confirmed bookings.");
          }
      
        }
        // map the data to Booking components
        let i = 0;
        bookings = bookings.map((booking) => 
        {
          i++;
          return (<Booking key={i} index={i} booking={booking} setBookingData={setBookingData}/>);
        });
        setBookingData(bookings);
      }
      else
      {
        $(".confirmed-bookings-message").text("You currently have no confirmed bookings.");
        setBookingData([]);
      }

    }
    else
    {
      $(".confirmed-bookings-message").text("There was a problem retrieving your confirmed bookings.");
      setBookingData([]);
    }


  }
  // run on page load
  useEffect(() =>{
    loadPage();
  }, [bookingData]);
  return (<div className="confirmed-bookings-section">
        <h1 className="title text-light central-header">My Bookings</h1>
        <h5 className="booking-cancellation-status-message text-light central-header"></h5>
        <h4 className="confirmed-bookings-message text-light central-header"></h4>
        <div id="confirmed-bookings">{bookingData}</div>
    </div>);
}