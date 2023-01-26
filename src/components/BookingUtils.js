import $ from "jquery";

// get bookable sessions for an activity for a specific date
export async function GetBookableSessions(activity, selectedDate)
{ 
    if (selectedDate === "")
    {
        return {"result" : "success", "sessions" : []};
    }
    return fetch("http://localhost:3001/bookable-sessions?activity=" + activity +"&selectedDate=" + selectedDate,
    {
        method: "GET",
        headers:
        {
        "Content-Type": "application/json"
        },
    }).catch((err) => console.log(err)).then(data => data.json());
}

// get snacks for activity
export async function GetSnacks(activity)
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
// update total price
export function UpdateTotalPrice()
{
    let basicsPrice = Number($("#basic-package-price").text());
    let extrasPrice = Number($("#booking-extras-price").text());
    let totalPrice = (basicsPrice + extrasPrice).toFixed(2);
    $("#total-price").text(totalPrice);
}

// validate user input, call LoginOrRegister, and then add basket item to localStorage if the input is valid
export async function AddToBasket(e, activity, {setBasket}, {navigate})
{
    e.preventDefault();
    let selectedSession = $(".booking-time-slot-outer.selected");
    if (selectedSession.length == 0)
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
        let sessionId = selectedSession.attr("id");
        let adults = $("#" + sessionId).find(".number-of-adults option:selected").first().val();
        let children = $("#" + sessionId).find(".number-of-children option:selected").first().val();
        // get user input for snacks
        let snackElements = $("#snacks-list").children().children();
        let snackData = [];
        for (let i = 0; i < snackElements.length; i++)
        {
            let snackElement = $("#snacks-list .snack-item:nth-child("+String(i+1)+")")[0];
            console.log(snackElement);
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
        // add the booking to the basket
        const basketData = {sessionId, activity, adults, children, snackData};
        setBasket(basketData); /* inside this custom hook's setBasket function, 
        the current basket item (basketData) is APPENDED to the existing ones
        instead of overwriting them, so you can have multiple bookings in your basket at once */
        navigate("/basket");
       
    }
}

// get the snack price, quantity and name from the booking id
export async function getLinkedSnacksDetails(bookingId, token, userId)
{ 
  return fetch("http://localhost:3001/get-linked-snacks-details",
  {
      method: "POST",
      headers:
      {
      "Content-Type": "application/json"
      },
      body: JSON.stringify({bookingId, token, userId})
  }).catch((err) => console.log(err)).then(data => data.json());
}
// save the booking either to be displayed in the basket (if isConfirmed = false) or the 'My Account' page's confirmed bookings
export async function SaveBooking(bookings, isConfirmed)
{
    let url = "http://localhost:3001/bookable-sessions";
    if (!isConfirmed)
    {
        url = "http://localhost:3001/bookable-sessions-basket";
    }
    let token = localStorage.getItem("token");
    let userId = localStorage.getItem("userId");
    return fetch(url,
    {
        method: "POST",
        headers:
        {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({bookings, isConfirmed, token, userId})
    }).catch((err) => console.log(err)).then(data => data.json());      
}