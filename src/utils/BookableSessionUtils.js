import $ from "jquery";
import seatManager from "./SeatManager.js";
/* Shared functions for all pages that let you view bookable sessions
and add them to your basket. For example, ice skating and bowling. */


// get bookable sessions for an activity for a specific date
export async function getBookableSessions(activity, selectedDate)
{ 
    if (selectedDate === "")
    {
        return {status: true, sessions : []};
    }
    return fetch("http://localhost:3001/bookable-sessions?activity=" + activity +"&selectedDate=" + selectedDate,
    {
        method: "GET",
        headers:
        {
        "Content-Type": "application/json"
        },
    }).catch((err) => console.log(err)).then(data => ({status: data.ok, body: data.json()}));
}


// get snacks for activity
export async function getSnacks(activity)
{
    return fetch("http://localhost:3001/bookable-snacks?activity=" + activity,
    {
        method: "GET",
        headers:
        {
        "Content-Type": "application/json"
        },
    }).catch((err) => console.log(err)).then(data => ({status: data.ok, body: data.json()}));
}
// update total price
export function updateTotalPrice(e=null, hasChildPrice=true)
{
    
    if (e)
    {
        // in this case this has been triggered by a change in some additional booking information which affects the price, for example, number of bowling games
        // get total price for all adults
        let selectedSession = $(".booking-time-slot-outer.selected");
        if (selectedSession.length === 1)
        {
            let adults = selectedSession.first().find(".number-of-adults option:selected").first().val();
            let adultPrice = selectedSession.first().find(".adult-price").first().text();
            let priceForAllAdults = adults * Number(adultPrice);
            let price = priceForAllAdults;
            if (hasChildPrice)
            {
                // get total price for all children
                let children = selectedSession.first().find("div .number-of-children option:selected").first().val();
                let childPrice = selectedSession.first().find(".child-price").first().text();
                let priceForAllChildren = children * Number(childPrice);
                // set new basic package price
                price = priceForAllAdults + priceForAllChildren;       
            }
            let newPrice = (price * Number(e.target.value)).toFixed(2);
            $("#basic-package-price").first().text(newPrice);
        }
    }

    // add basic package price and booking extras price to get total price
    let basicsPrice = Number($("#basic-package-price").text());
    let extrasPrice = Number($("#booking-extras-price").text());
    let totalPrice = (basicsPrice + extrasPrice).toFixed(2);
    $("#total-price").text(totalPrice);
}


// validate user input, set basket data in local storage, then navigate to the basket web page
export async function addToBasket(e, activity, {setBasket}, {navigate})
{
    e.preventDefault();
    let selectedSession = $(".booking-time-slot-outer.selected");
    if (selectedSession.length === 0)
    {
        // set invalid booking message - no time slot selected
        $(".invalid-booking-message").text("Invalid input. Please select a time slot.");

    }
    else if (selectedSession.hasClass("invalid-input"))
    {
        // set invalid booking message - too many attendees
        $(".invalid-booking-message").text("Invalid input. Sorry, but this session does not have enough slots left for the number of people in your group. Please try a different session.");
    }
    else
    {
        // clear invalid booking message
        $(".invalid-booking-message").text("");
        // get user input for basic booking details. The date is included in the bookable session so only the number of adults and children are needed.
        let adults = selectedSession.first().find(".number-of-adults option:selected").first().val();
        let children = selectedSession.first().find("div .number-of-children option:selected").first().val();
        if (activity === "cinema" || activity === "theatre")
        {
            children = 0; // children are not distinguished from adults for these activities
        }
        // get user input for snacks
        let snackElements = $("#snacks-list").children().children();
        let snackData = [];
        for (let i = 0; i < snackElements.length; i++)
        {
            let quantity = $("#snacks-list .snack-item:nth-child("+String(i+1)+") option:selected").val();
            let id = $("#snacks-list .snack-item:nth-child("+String(i+1)+")").attr("id").replace("snack", "");
            if (quantity > 0)
            {
                let snack = {
                    snackId: id,
                    snackQuantity: quantity
                };
                snackData.push(snack);
            }
        }
        // add further fields from the booking to the basket, for example, the number of games and if the rails are up by default for bowling
        let additionalDetails = {};
        if (activity === "bowling")
        {
            additionalDetails.games = $(".number-of-games option:selected").first().val();
            additionalDetails.rails = $(".customize-bowling .rails-up").is(":checked");
        }
        else if (activity === "cinema" || activity === "theatre")
        {
            if (!seatManager.validateSeatSelections())
            {
                $(".invalid-booking-message").text("Invalid input. Please select the same number of seats as the number of people attending.");
                return;
            }
            else
            {
                additionalDetails.seatIds = seatManager.getSelectedSeatIds();
            }
        }
        // add the booking to the basket
        let sessionId = selectedSession.attr("id");
        const basketData = {sessionId, activity, adults, children, snackData, additionalDetails};
        setBasket(basketData); /* inside the custom hook's setBasket function, 
        the current basket item (basketData) is *appended* to the existing ones
        instead of overwriting them, so you can have multiple bookings in your basket at once */
        navigate("/basket");
       
    }
}


// retrieve the snacks available to pre-order for a bookable session
export async function retrieveSnacks(e, activity, beforeOrAfter, setSnacks)
{
    let activityNamesMap = {"iceSkating": "ice skating session", "bowling": "bowling session", "cinema": "cinema visit", "theatre": "theatre trip"};
    let activityName = activityNamesMap[activity];
    e.preventDefault();
    let snacksData = await(getSnacks(activity));
    if (snacksData.status)
    {
        snacksData = await snacksData.body;
        if (snacksData.snacks.length > 0)
        {
            $(".snacks-message").text("Add in some pre-ordered snacks for " + beforeOrAfter +  " your " + activityName + "! (Optional)");
            setSnacks(snacksData.snacks);
            $(e.target).attr("hidden", "true");
        }
        else
        {
            $(".snacks-message").text("No snacks are currently available to pre-order for " + beforeOrAfter + " your " + activityName + ".");
            $(e.target).text("Refresh");
        }
    }

    else
    {
        $(".snacks-message").text("There was a problem retrieving the snacks available to pre-order for " + beforeOrAfter + " your " + activityName + ".");
        $(e.target).text("Refresh");
    }
}

// clear bookable sessions upon clearing date
export async function resetBookableSessions(activity, setBSessions)
{
    let res = await getBookableSessions(activity, "");
    if (res.status)
    {
        setBSessions([]);
        $(".time-slots-message").text("Please select a date first.");
    }
}

// retrieve the activity sessions available to reserve
export async function retrieveBookableSessions(e, activity, setBSessions)
{
    if (e.target.value === "")
    {
        // if date has been cleared/reset
        await resetBookableSessions(activity, setBSessions);
        return;
    }
    else 
    {
        let res = await getBookableSessions(activity, e.target.value);
        if (res.status)
        {
            let body = await res.body;
            if (body.result === "success")
            {
            let bookableSessionsData = body.sessions;
            // do not display bookable sessions that have already been added to this user's basket
            // first get the basket's session ids...
            let basketSessionIds = [];
            let basket = localStorage.getItem("basket");
            if (basket)
            {
                if (body.result === "success")
                    basket = JSON.parse(basket);
                    if (basket)
                    {
                        
                        let basketItems = basket.items; 
                        for (let i = 0; i < basketItems.length; i++)
                        {
                            basketSessionIds.push(Number(basketItems[i].sessionId));
                        }
                        // ...then check for matches (bookable sessions already added to user's basket)
                        let sessionsToRemoveIndexes = [];
                        for (let i = 0; i < bookableSessionsData.length; i++)
                        {
                            let sessionId = bookableSessionsData[i].sessionId;
                            if (basketSessionIds.includes(Number(sessionId)))
                            {
                                sessionsToRemoveIndexes.push(i);
                            }
                        }  
                        // remove matches
                        for (let i = 0; i < bookableSessionsData.length; i++)
                        {
                            if (sessionsToRemoveIndexes.includes(i))
                            {
                                bookableSessionsData.splice(i, 1);
                            }
                        }
                    }     
                    // now display the results and corresponding time slots message
                }
                if (bookableSessionsData.length > 0)
                {
                    $(".time-slots-message").text("Select a Time Slot:");
                    setBSessions(bookableSessionsData);
                }
                else
                {
                    $(".time-slots-message").text("Sorry, there are no sessions available to book on this date that you haven't already placed in your basket.");
                    setBSessions([]);
                }
            }
            else if (body.result === "dateRequired")
            {
                $(".time-slots-message").text("Please select a date first.");
            }
        }
        else
        {
            $(".time-slots-message").text("There was a problem retrieving sessions.");
        }
    }
} 

// load and style seats
export async function setSelectableSeats(activity)
{
    let seatIds = [];
    $(".seat").each(() => seatIds.push($(this).attr("id")));
    let res = await seatManager.retrieveAllSeatsData();
    if (res.status)
    {
        let body = await res.body;
        let seats = body.seats;
        seatManager.setAllSeats(activity, seatIds, seats); // sets all seat data (per seat - id, whether premium or not, whether available or not)
        seatManager.styleSeats(seats, activity);
    }
    else
    {
      $(".invalid-booking-message").text("There was a problem retrieving seat data.");
    }
}
