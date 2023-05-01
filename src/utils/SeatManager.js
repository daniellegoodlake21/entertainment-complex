import $ from "jquery";
import CINEMA_PREMIUM_SEAT_ADDITIONAL_COST from "./BookingUtils.js";
class SeatManager
{
    constructor()
    {
        this.seats = null; // in setup, this is set to an object containing an array of all seat data (id, seat type, if it is available)
        this.numberOfSelectableSeats = 0;
        this.totalPrice = 0;
        this.selectedSeatIds = [];
        this.premiumSeatCount = 0;
    }

    // get all selected seat ids to be added to the basket
    getSelectedSeatIds()
    {
        return this.selectedSeatIds;
    }

    // check that the number of selected seats is equal to the number of guests attending
    validateSeatSelections()
    {
        let numberOfSelectableSeats = Number($(".number-of-adults").first().find("option:selected").first().val());
        if (this.selectedSeatIds.length === numberOfSelectableSeats)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    // sets all seat data
    setAllSeats(activity, seatIds, seatsData)
    {
        this.activity = activity;
        this.seatIds = seatIds;
        this.seats = seatsData;
        this.seats.forEach(seat => 
        {
            let additionalCost;
            if (activity === "cinema")
            {
                additionalCost = seat.premium ? CINEMA_PREMIUM_SEAT_ADDITIONAL_COST : 0; // add £2 for each premium cinema seat
                $("#" + seat.seatId).first().off('click').on("click", () => this.toggleSeatSelected(seat.seatId, additionalCost));                      
            }
        });
    }

    // reset (deselect) selected seats
    deselectAllSeats()
    {
        $(".seat").removeClass("selected");
        this.selectedSeatIds = [];
        this.premiumSeatCount = 0;
    }


    // this is called when the user modifies the number of guests attending
    setNumberOfSelectableSeats(numberOfSelectableSeats)
    {
        this.numberOfSelectableSeats = numberOfSelectableSeats;
        this.deselectAllSeats();
    }

    // retrieve seat data from the database
     async retrieveAllSeatsData()
    {
        let sessionIdParameter = ""; // the default, if no session (film or show) has been selected
        let selectedSession = $(".booking-time-slot-outer.selected");
        if (selectedSession.length === 1)
        {
            let sessionId = selectedSession.first().attr("id");
            sessionIdParameter = "?sessionId=" + sessionId;
        }
        return fetch("http://localhost:3001/get-cinema-seat-data" + sessionIdParameter, 
        {
            method: "GET",
            headers:
            {
            "Content-Type": "application/json"
            },
        }).catch((err) => console.log(err)).then(data => ({status: data.ok, body: data.json()}));
    }
    

    // set a different colour for premium and unavailable seats
    styleSeats(seats, activity)
    {
        for (let i = 0; i < seats.length; i++)
        {
            if (!seats[i].available)
            {
                $("#" + seats[i].seatId).addClass("unavailable");
            }
            else
            {
                $("#" + seats[i].seatId).removeClass("unavailable");              
            }
            if (activity === "cinema")
            {
                if (seats[i].premium)
                {
                    // get the seat element for this seat id
                    $("#" + seats[i].seatId).addClass("premium");
                }
            }
        }
    } 
    
    // called when a seat is deselected
    removeSelectedSeatId(seatId)
    {
        for (let i = 0; i < this.selectedSeatIds.length; i++)
        {
            if (this.selectedSeatIds[i] === seatId)
            {
                this.selectedSeatIds.splice(i, 1);
            }
        }
    }

    // this is called when the user clicks on a seat to either select or deselect it
    async toggleSeatSelected(seatId, additionalCost)
    {
        const toggleAdditionalCost = (isAddition) =>
        {
            let currentPrice = Number($("#basic-package-price").text());
            let updatedPrice = isAddition ? currentPrice + additionalCost : currentPrice - additionalCost;
            $("#basic-package-price").text(updatedPrice.toFixed(2));
            let extrasPrice = Number($("#booking-extras-price").text());
            $("#total-price").text((updatedPrice + extrasPrice).toFixed(2));
            // if premium *cinema* seat (therefore only 2 types of seat - standard and premium) add to/subtract from premium seat count
            if (additionalCost === CINEMA_PREMIUM_SEAT_ADDITIONAL_COST)
            {
                if (isAddition)
                {
                    this.premiumSeatCount++;
                }
                else
                {
                    this.premiumSeatCount--;
                }
            }
        }
        // seats are only selectable once a session has been selected
        if ($(".booking-time-slot-outer.selected").length === 1)
        {
            // cannot select unavailable seat
            if ($("#" + seatId).first().hasClass("unavailable"))
            {
                return;
            }
            else
            {
                // check if selected before setting. If it is selected, deselect it.
                // Otherwise, select it but only if there are still selectable seats remaining
                if (!$("#" + seatId).first().hasClass("selected"))
                {
                    if (this.numberOfSelectableSeats === 0)
                    {
                        return;
                    }
                    this.selectedSeatIds.push(seatId);
                    toggleAdditionalCost(true);
                    this.numberOfSelectableSeats--;
                }
                else
                {
                    this.numberOfSelectableSeats++;
                    this.removeSelectedSeatId(seatId);
                    toggleAdditionalCost(false);
                }
                $("#" + seatId).first().toggleClass("selected");
            }
        }
    }
    
    // used to update price when adding to basket
    getSelectedPremiumSeatCount()
    {
        return this.premiumSeatCount;
    }
}

const seatManager = new SeatManager();
export default seatManager;