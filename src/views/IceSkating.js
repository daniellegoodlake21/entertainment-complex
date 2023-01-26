import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";
import $ from "jquery";
import BookableSessionList from "../components/BookableSessionList.js";
import SnacksList from "../components/SnacksList.js";
import {GetBookableSessions, GetSnacks, AddToBasket} from "../components/BookingUtils.js";
import useBasket from "../hooks/useBasket.js";
function IceSkating()
{
    const {basket, setBasket} = useBasket();
    const navigate = useNavigate();
    
    const activity = "iceSkating";

    let [snacks, setSnacks] = useState();
    let [bSessions, setBSessions] = useState();
    // retrieve the snacks available to pre-order
    const retrieveSnacks = async e =>
    {
        e.preventDefault();
        let snacksData = await(GetSnacks(activity));
        if (snacksData.result === "success")
        {
            if (snacksData.snacks.length > 0)
            {
                $(".snacks-message").text("Add in some pre-ordered snacks for after your ice skating session! (Optional)");
                setSnacks(snacksData.snacks);
                $(e.target).attr("hidden", "true");
            }
            else
            {
                $(".snacks-message").text("No snacks are currently available to pre-order for after your ice skating session.");
                $(e.target).text("Refresh");
            }
        }
        else if (snacksData.result === "error")
        {
            $(".snacks-message").text("There was a problem retrieving the snacks available to pre-order for after your ice skating session.");
            $(e.target).text("Refresh");
        }
    }
    // clear bookable sessions upon clearing date
    const resetBookableSessions = async () =>
    {
       let bookableSessionsData = await GetBookableSessions(activity, "");
       setBSessions(bookableSessionsData.sessions);
       $(".time-slots-message").text("Please select a date first.");
    }

    // retrieve the ice skating sessions available to reserve
    const retrieveBookableSessions = async e => 
    {
        if (e.target.value === "")
        {
            // if date has been cleared/reset
            await resetBookableSessions();
            return;
        }
        else 
        {
            let bookableSessionsData = await GetBookableSessions(activity, e.target.value);
            if (bookableSessionsData.result === "success")
            {
                // do not display bookable sessions that have already been added to this user's basket
                // first get the basket's session ids...
                let basketSessionIds = [];
                let basket = localStorage.getItem("basket");
                if (basket)
                {
                    basket = JSON.parse(basket);
                    let basketItems = basket.items; 
                    for (let i = 0; i < basketItems.length; i++)
                    {
                        basketSessionIds.push(Number(basketItems[i].sessionId));
                    }
                    // ...then check for matches
                    let length = bookableSessionsData.sessions.length;
                    for (let i = 0; i < length; i++)
                    {
                        let sessionId = bookableSessionsData.sessions[i].session_id;
                        if (basketSessionIds.includes(Number(sessionId)))
                        {
                            bookableSessionsData.sessions.splice(i, 1);
                        }
                    }  
                }
                // now display the results and corresponding time slots message
                if (bookableSessionsData.sessions.length > 0)
                {
                    $(".time-slots-message").text("Select a Time Slot:");
                    setBSessions(bookableSessionsData.sessions);
                }
                else
                {
                    $(".time-slots-message").text("Sorry, there are no sessions available to book on this date that you haven't already placed in your basket.");
                    setBSessions([]);
                }

            }
            else if (bookableSessionsData.result === "dateRequired")
            {
                $(".time-slots-message").text("Please select a date first.");
            }
            else if (bookableSessionsData.result === "error")
            {
                $(".time-slots-message").text("There was a problem retrieving ice skating sessions.");
            }
          }
    }
    return (<div> 
    <form className="customize-booking-package-form" onSubmit={(e) => AddToBasket(e, "iceSkating", {setBasket}, {navigate})}>
        <h1 className="title text-light central-header">Book an Ice Skating Session</h1>
        <div className="container-fluid">
            <div className="row">
                <div className="customize-booking-basics col-lg-3">
                    <h2>Basic Booking Details</h2>
                    <label htmlFor="booking-date">Select Date of Visit:</label>
                    <br/>
                    <input type="date" onChange={(e) => retrieveBookableSessions(e)} id="booking-date" required/>
                    <p className="invalid-message" hidden>Sorry, the date you have picked is invalid.<br/>Please pick a date between today and 14 days ahead of today.</p>
                    <div className="show-when-date-selected">
                        <div className="booking-time-slots-section">
                            <br/>
                            <p className="time-slots-message"></p>
                            <div id="bookable-sessions-section">
                                <BookableSessionList bookableSessions={bSessions} setBookableSessions={setBSessions}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="customize-booking-extras col-lg-3">
                    <h2>Booking Extras</h2>
                    <button onClick={(e) => retrieveSnacks(e)} className="snacks-btn btn btn-lg btn-dark form-control form-control-rounded">See Available Snacks</button>
                    <p className="snacks-message"></p>
                    <SnacksList snacks={snacks} setSnacks={setSnacks}/>
                </div>
                <div className="add-booking-to-basket-form col-lg-3">
                    <h2>Booking Summary</h2>
                    <h5>Basic Package Price: £<span className="subtotal-price" id="basic-package-price" >0.00</span></h5>
                    <h5>Booking Extras Price: £<span className="subtotal-price" id="booking-extras-price">0.00</span></h5>
                    <h4>Total Price: £<span id="total-price">0.00</span></h4>
                    <input type="submit" className="btn btn-lg btn-dark form-control form-control-rounded" value="Add to Basket"/>
                    <p className="invalid-booking-message"></p>
                </div>
            </div>
        </div> 

    </form>
    </div>);
}
export default IceSkating;