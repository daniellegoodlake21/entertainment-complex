import { React, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";
import $ from "jquery";
import BookableSessionList from "../components/BookableSessionList.js";
import SnacksList from "../components/SnacksList.js";

async function getBookableSessions(activity, selectedDate)
{ 
    return fetch("http://localhost:3001/bookable-sessions?activity=" + activity +"&selectedDate=" + selectedDate,
    {
        method: "GET",
        headers:
        {
        "Content-Type": "application/json"
        },
    }).catch((err) => console.log(err)).then(data => data.json());
}
async function getSnacks(activity)
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
function IceSkating()
{
    const activity = "iceSkating";
    let [snacks, setSnacks] = useState();
    let [bSessions, setBSessions] = useState();

    // retrieve the snacks available to pre-order
    const retrieveSnacks = async e =>
    {
        e.preventDefault();
        let snacksData = await(getSnacks(activity));
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
    // retrieve the ice skating sessions available to reserve
    const retrieveBookableSessions = async e => 
    {
        let bookableSessionsData = await getBookableSessions(activity, e.target.value);
        if (bookableSessionsData.result === "success")
        {
            if (bookableSessionsData.sessions.length > 0)
            {
                $(".time-slots-message").text("Pick a Time Slot:");
                setBSessions(bookableSessionsData.sessions);
            }
            else
            {
                $(".time-slots-message").text("Sorry, there are no sessions available to book on this date.");
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
    return (<div> 
    <form className="customize-booking-package-form" method="post" action="/ice-skating">
        <h1 className="title text-light central-header">Book an Ice Skating Session</h1>
        <div className="container-fluid">
            <div className="row">
                <div className="customize-booking-basics col-lg-6">
                    <h2>Basic Booking Details</h2>
                    <label htmlFor="booking-date">Select Date of Visit:</label>
                    <br/>
                    <input type="date" onChange={(e) => retrieveBookableSessions(e)} id="booking-date" required/>
                    <p className="invalid-message" hidden>Sorry, the date you have picked is invalid.<br/>Please pick a date between today and 14 days ahead of today.</p>
                    <div className="show-when-date-selected">
                        <br/>
                        <label htmlFor="number-of-attendees">Enter the number of people attending (max 8 per booking):</label>
                        <br/>
                        <select id="number-of-attendees">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                        </select>
                        <div className="booking-time-slots-section">
                            <br/>
                            <p className="time-slots-message">Please select a date first.</p>
                            <div id="bookable-sessions-section">
                                <BookableSessionList bookableSessions={bSessions} setBookableSessions={setBSessions}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="customize-booking-extras col-lg-6">
                    <h2>Booking Extras</h2>
                    <button onClick={(e) => retrieveSnacks(e)} className="snacks-btn btn btn-lg btn-dark form-control form-control-rounded">See Available Snacks</button>
                    <p className="snacks-message"></p>
                    <SnacksList snacks={snacks} setSnacks={setSnacks}/>
                </div>
            </div>
        </div> 
    </form>
    </div>);
}
export default IceSkating;