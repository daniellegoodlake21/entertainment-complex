import PropTypes from 'prop-types';
import $ from 'jquery';
import { loadFromLocalStorage, loadFromDatabase, loadBookings } from './BookingUtils.js';
import { useEffect } from 'react';
const cancelBooking = async (bookingId, token, userId) =>
{
    return fetch("http://localhost:3001/cancel-booking",
    {
        method: "POST",
        headers:
        {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({bookingId, token, userId})
    }).catch((err) => console.log(err)).then(data => data.json());
}
function Booking({index, booking, setBookingData})
{
    const handleSubmit = async (e) =>
    {
        e.preventDefault();
        let token = localStorage.getItem("token");
        // if it exists in the local storage's basket, remove it
        let basket = localStorage.getItem("basket");
        if (basket)
        {
            let basketItems = JSON.parse(basket);
            if (basketItems)
            {
                /* since you can't add multiple bookings from the same session to the basket at once 
                (to prevent the slots available decreasing to below 0), the booking to remove can be identified by the session id */
                for (let i = 0; i < basketItems.items.length; i++)
                {
                 
                    if (basketItems.items[i].sessionId = booking.sessionId)
                    {
              
                        basketItems.items.splice(i, 1);
                    }
                }
            }
            localStorage.setItem("basket", JSON.stringify(basketItems));  
            console.log(basketItems);
            let bookings = await loadFromLocalStorage(token);
            loadBookings(bookings, setBookingData);  
        }
        // remove from database if logged in (if not it will not do anything on the server side as the token will be invalid)

        let userId = localStorage.getItem("userId");
        let bookingId = booking.bookingId;
        if (!bookingId)
        {
            return; // in this case it hasn't been loaded from the database as retrieval from the database results in defining a booking id
        }
        let res = await cancelBooking(bookingId, token, userId);
        if (res.result === "success")
        {
            let bookings = await loadFromDatabase(token);
            loadBookings(bookings, setBookingData);
            $(".booking-cancellation-status-message").text("Your booking has been cancelled.");
           
        }
        else if (res.result === "error")
        {
            $(".booking-cancellation-status-message").text("There was a problem cancelling your booking.");
        }
    }
    $(".booking-cancellation-status-message").text("");
    let activity = booking.activity;
    let uppercaseFirstLetter = activity.slice(0,1).toUpperCase();
    activity = uppercaseFirstLetter + activity.replace(/([A-Z])/g, ' $1').trim().slice(1, activity.length+1);
    let keyIndex = 0;
    let date = new Date(booking.date);

    // if no snacks display message below snacks header
    useEffect(() =>
    {
        if (booking.snackData.length === 0)
        {
            $("#booking-" + index).find(".no-snacks-message").text("No snacks have been added to this booking.");
        }
    }, []);
    
    let key = "booking-" + index;
    return (
    <div className="booking-data-item added-booking" id={key}>
        <h3>{activity}</h3>
        
        <h4>{date.getDate()}/{date.getMonth()+1}/{date.getFullYear()} at {booking.time.slice(0, 5)}</h4>
        <p>Number of adults attending: {booking.adults}</p>
        <p>Number of children attending: {booking.children}</p>
        <h4>Booking Extras:</h4>
        <p>Snacks:</p>
        <ul>
            {
                booking.snackData.map(snack=>
                    {
                        keyIndex++;
                        return <li key={keyIndex}>{snack.snackName} x{snack.snackQuantity}</li>;
                    })
            }
        </ul>        
        <p className="no-snacks-message"></p>      
        <h4 className="booking-data-item-price">Price: £<span className="price">{booking.totalPrice.toFixed(2)}</span></h4>
        <form onSubmit={handleSubmit}>
            <input type="submit" className="cancel-booking-btn btn btn-md btn-light form-control form-control-rounded" value="Cancel"/>              
        </form>
    </div>)
}
Booking.propTypes =
{
    booking: PropTypes.object.isRequired
};
export default Booking;