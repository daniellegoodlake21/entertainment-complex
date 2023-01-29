import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";
import BookableSessionList from "../components/BookableSessionList.js";
import SnacksList from "../components/SnacksList.js";
import {addToBasket,  retrieveSnacks, retrieveBookableSessions} from "../utils/BookableSessionUtils.js";
import useBasket from "../hooks/useBasket.js";
function IceSkating()
{
    const {basket, setBasket} = useBasket();
    const navigate = useNavigate();
    
    const activity = "iceSkating";

    let [snacks, setSnacks] = useState();
    let [bSessions, setBSessions] = useState();


    return (<div> 
    <form className="customize-booking-package-form" onSubmit={(e) => addToBasket(e, "iceSkating", {setBasket}, {navigate})}>
        <h1 className="title text-light central-header">Book an Ice Skating Session</h1>
        <div className="container-fluid">
            <div className="row">
                <div className="customize-booking-basics col-lg-3">
                    <h2>Basic Booking Details</h2>
                    <label htmlFor="booking-date">Select Date of Visit:</label>
                    <br/>
                    <input type="date" onChange={(e) => retrieveBookableSessions(e, activity, setBSessions)} id="booking-date" required/>
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
                    <button onClick={(e) => retrieveSnacks(e, activity, "after", setSnacks)} className="snacks-btn btn btn-lg btn-dark form-control form-control-rounded">See Available Snacks</button>
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