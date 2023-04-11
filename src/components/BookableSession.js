import $ from "jquery";
import PropTypes from 'prop-types';
import { setSelectableSeats, updateTotalPrice } from "../utils/BookableSessionUtils.js";
import seatManager from "../utils/SeatManager.js";

function BookableSession({session})
{
    // update booking price, dependent on number of adults and children going
    const updateBookingPrice = (adults, children) =>
    {
        // update booking price
        let sessionPrice = (adults * session.adultPrice);
        if (typeof(children) === Number)
        {
            sessionPrice += (children * session.childPrice);
        }
        if ($("#price-multiplier").length === 1)
        {
            sessionPrice = sessionPrice * $("#price-multiplier").first().val();
        }
        sessionPrice = sessionPrice.toFixed(2);
        $("#basic-package-price").text(sessionPrice);
        updateTotalPrice(null, session.activity);
    }


    const setupSeats = (setSelectableSeating=false) =>
    {
        // if it is an activity with a seating plan (cinema or theatre) then set the selectable seats
        if (session.activity === "cinema" || session.activity === "theatre")
        {
            let numberOfSelectableSeats = Number($(".number-of-adults").first().find("option:selected").first().val());
            seatManager.setNumberOfSelectableSeats(numberOfSelectableSeats);
            if (setSelectableSeating)
            {
                setSelectableSeats(session.activity, numberOfSelectableSeats);
            }
        }
    }

    // select session
    const selectSession = e =>
    {
        // set reusable variables
        let outer = $(e.target).parent().parent();
        // update visually to show this session has been selected
        e.preventDefault();
        outer.addClass("selected");
        outer.siblings().removeClass("selected");
        outer.siblings().removeClass("invalid-input");
        $(e.target).text("Selected");
        outer.siblings(".booking-time-slot-outer").children(".booking-slot-item").first().children(".btn").first().text("Select");
        // display the number of attendees input and label
        $(e.target).parent().siblings(".attendees-outer").removeAttr("hidden");
        outer.siblings(".booking-time-slot-outer").children(".attendees-outer").attr("hidden", "true");
        let adults = $(".selected .attendees-outer .number-of-adults").first().find("option:selected").first().val();
        let children = $(".selected .attendees-outer .number-of-children").first().find("option:selected").first().val();
        updateBookingPrice(adults, children);
        $(".invalid-booking-message").text("");
        setupSeats(true); // checks if applicable activity, and if so, sets seat data

    };

    const checkAttendeesCount = e =>
    {
        // limit the number of attendees to the number of slots remaining if the remaining slots are less than the number of attendees
        let adults = Number($(e.target).parent().find(".number-of-adults option:selected").val());
        let children = Number($(e.target).parent().find("div .number-of-children option:selected").val());
        let attendees = adults + children;
        if (session.slotsRemaining < attendees)
        {
            $(e.target).siblings(".too-many-attendees-message").text("Sorry, there aren't enough available slots.\nThe total number of adults and children must be " + session.slotsRemaining + " or less.");
            $("#" + session.sessionId).addClass("invalid-input");
        }
        else
        {
            $(e.target).siblings(".too-many-attendees-message").text("");
            $("#" + session.sessionId).removeClass("invalid-input");
            $(".invalid-booking-message").text("");
        }
        updateBookingPrice(adults, children);
        setupSeats(); // checks if applicable activity, and if so, sets seat data
    }

    // display price per person (with separate child price only for applicable activities)
    const getPricePerPerson = () =>
    {
        if (session.activity === "bowling" || session.activity === "iceSkating")
        {
            return <p>Price Per Person:<br/>Adult: £<span className="adult-price">{session.adultPrice.toFixed(2)}</span><br/>Child: £<span className="child-price">{session.childPrice.toFixed(2)}</span></p>;
              
        }
        else
        {
            return <p>Price Per Person: £<span className="adult-price">{session.adultPrice.toFixed(2)}</span></p>
        }
    }


    // display dropdowns for price per person
    const getPricePerPersonOptions = () =>
    {
        const getChildPricePerPersonOption = () =>
        {
            // if applicable, add the number of children input option
            if (session.activity === "bowling" || session.activity === "iceSkating")
            {
                output +=  <div><label htmlFor="number-of-children">Select number of children:</label>
                            <br/>
                                <select className="number-of-children" name="number-of-children">
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                </select>
                                <p className="too-many-attendees-message"></p></div>;
            }
            else
            {
                return null;
            }
        }
        let guestText = session.activity === "bowling" || session.activity === "iceSkating" ? "Select number of adults: " : "Select number of guests: ";
        // set the number of adults input option, and the number of children option if applicable
        let output = <div className="attendees-outer" onChange={(e) => checkAttendeesCount(e)} hidden>
        <label htmlFor="number-of-adults">{guestText}</label>
        <br/>
        <select className="number-of-adults" name="number-of-adults">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
        </select>
        <br/>
        {
            getChildPricePerPersonOption()
        }
        </div>;
        return output;

    }
    // get show details (for cinema and theatre only)
    const getShowDetails = () =>
    {
        if (session.activity === "cinema" || session.activity === "theatre")
        {
            return <div className="show-details">
                <h4>{session.show.title}</h4>
                <p>{session.show.description}</p>
                <h6>Age Rating: <span>{session.show.ageRating}</span></h6>
                </div>
        }
        else
        {
            return null;
        }
    }

    return (
        <div id={session.sessionId} className="booking-time-slot-outer">
            {
                getShowDetails()
            }
            <div className="text-light booking-time-slot-item">
                <h6 className="time-slot">{session.time.slice(0, 5)}</h6>
                <p>Remaining Available Slots: <span className="slots-available">{session.slotsRemaining}</span></p>
                {
                    getPricePerPerson()
                }
                <br/>
                <button className="btn btn-light btn-lg" onClick={(e) => selectSession(e)}>Select</button>
            </div>
            {
                getPricePerPersonOptions()
            }
        </div>
    );
}
BookableSession.propTypes =
{
    session: PropTypes.object.isRequired,
};
export default BookableSession;