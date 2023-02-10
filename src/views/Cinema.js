import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";
import BookableSessionList from "../components/BookableSessionList.js";
import SnacksList from "../components/SnacksList.js";
import {addToBasket,  retrieveSnacks, retrieveBookableSessions, setSelectableSeats} from "../utils/BookableSessionUtils.js";
import useBasket from "../hooks/useBasket.js";

function Cinema()
{
    const {basket, setBasket} = useBasket();
    const navigate = useNavigate();
    
    const activity = "cinema";

    const [snacks, setSnacks] = useState();
    const [bSessions, setBSessions] = useState();

    useEffect(() =>
    {
      setSelectableSeats("cinema");
    }, []);

    return (<div> 
    <form className="customize-booking-package-form" onSubmit={(e) => addToBasket(e, "cinema", {setBasket}, {navigate})}>
        <h1 className="title text-light central-header">Book a Cinema Film</h1>
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
                <div className="seat-view col-lg-3">
                  <h2>Select Your Seats</h2>
                  <div className="cinema-screen">
                    <h5 className="central-header">Cinema Screen</h5>
                  </div>
                  <div className="seat-selector">

                    <div className="seat" id="a1"></div>
                    <div className="seat" id="a2"></div>
                    <div className="seat" id="a3"></div>
                    <div className="seat" id="a4"></div>
                    <div className="seat" id="a5"></div>
                    <h5 className="seat-row">A</h5>
                    <br/>
                    <div className="seat" id="b1"></div>
                    <div className="seat" id="b2"></div>
                    <div className="seat" id="b3"></div>
                    <div className="seat" id="b4"></div>
                    <div className="seat" id="b5"></div>
                    <h5 className="seat-row">B</h5>  
                    <br/>
                    <div className="seat" id="c1"></div>
                    <div className="seat" id="c2"></div>
                    <div className="seat" id="c3"></div>
                    <div className="seat" id="c4"></div>
                    <div className="seat" id="c5"></div>
                    <h5 className="seat-row">C</h5>
                    <br/>
                    <div className="seat" id="d1"></div>
                    <div className="seat" id="d2"></div>
                    <div className="seat" id="d3"></div>
                    <div className="seat" id="d4"></div>
                    <div className="seat" id="d5"></div>           
                    <h5 className="seat-row">D</h5>
                    <br/>
                    <div className="seat" id="e1"></div>
                    <div className="seat" id="e2"></div>
                    <div className="seat" id="e3"></div>
                    <div className="seat" id="e4"></div>
                    <div className="seat" id="e5"></div>      
                    <h5 className="seat-row">E</h5>
                    <br/>
                    <div className="seat" id="f1"></div>
                    <div className="seat" id="f2"></div>
                    <div className="seat" id="f3"></div>
                    <div className="seat" id="f4"></div>
                    <div className="seat" id="f5"></div>
                    <h5 className="seat-row">F</h5>
                    <br/>       
                    <div className="seat" id="g1"></div>
                    <div className="seat" id="g2"></div>
                    <div className="seat" id="g3"></div>
                    <div className="seat" id="g4"></div>
                    <div className="seat" id="g5"></div>
                    <h5 className="seat-row">G</h5>
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="customize-booking-extras small">
                      <h2>Booking Extras</h2>
                      <button onClick={(e) => retrieveSnacks(e, activity, "before", setSnacks)} className="snacks-btn btn btn-lg btn-dark form-control form-control-rounded">See Available Snacks</button>
                      <p className="snacks-message"></p>
                      <SnacksList snacks={snacks} setSnacks={setSnacks}/>
                  </div>
                  <div className="add-booking-to-basket-form small">
                        <h2>Booking Summary</h2>
                        <h5>Basic Package Price: £<span className="subtotal-price" id="basic-package-price" >0.00</span></h5>
                        <h5>Booking Extras Price: £<span className="subtotal-price" id="booking-extras-price">0.00</span></h5>
                        <h4>Total Price: £<span id="total-price">0.00</span></h4>
                        <input type="submit" className="btn btn-lg btn-dark form-control form-control-rounded" value="Add to Basket"/>
                        <p className="invalid-booking-message"></p>
                    </div>  
            </div>
          </div> 
        </div>
    </form>
    </div>);
}
export default Cinema;