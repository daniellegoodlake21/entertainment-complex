import $ from "jquery";

class SeatManager
{
    constructor()
    {
        this.seats = null; // in setup, this is set to an object containing an array of all seat data (id, seat type, if it is available)
        this.numberOfSelectableSeats = 0;
        this.totalPrice = 0;
        this.selectedSeatIds = [];
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
           $("#" + seat.seatId).first().on("click", () => this.toggleSeatSelected(seat.seatId)); 
        });
    }

    // get total price of all selected seats, charging more for better seats
    calculateTotalPrice()
    {
        const cinemaPremiumSeatMultiplier = 1.5;
        if (this.seats == undefined)
        {
            $(".invalid-booking-message").text("Seat details have not been successfully retrieved.");
            this.totalPrice = (0).toFixed(2);
        }
        else
        {
            // for cinema and theatre bookings, there is one shared price for all guests (adult-price) regarldess of age
            let pricePerSeat = Number($(".booking-time-slot-outer.selected .booking-time-slot-item p .adult-price").first().text());
            this.totalPrice = 0;
            for (let i = 0; i < this.seats.length; i++)
            {
                
                let seat = this.seats[i];
                if (this.activity === "cinema" && seat.premium)
                {
                    this.totalPrice += (pricePerSeat * cinemaPremiumSeatMultiplier);
                }
                else if (this.activity === "cinema")
                {
                    this.totalPrice += pricePerSeat;
                }
            }
        }
        return this.totalPrice;
    }

    // reset (deselect) selected seats
    deselectAllSeats()
    {
        $(".seat").removeClass("selected");
        this.selectedSeatIds = [];
    }


    // this is called when the user modifies the number of guests attending
    setNumberOfSelectableSeats(numberOfSelectableSeats)
    {
        this.numberOfSelectableSeats = numberOfSelectableSeats;
        this.deselectAllSeats();
        this.calculateTotalPrice();
    }

    // retrieve seat data from the database
     async retrieveAllSeatsData()
    {
        let sessionIdParameter = ""; // the default, if no session (film or show) has been selected
        
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
    async toggleSeatSelected(seatId)
    {
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
                    this.numberOfSelectableSeats--;
                }
                else
                {
                    this.numberOfSelectableSeats++;
                    this.removeSelectedSeatId(seatId);
                }
                $("#" + seatId).first().toggleClass("selected");
            }
        }
    }
}

const seatManager = new SeatManager();
export default seatManager;