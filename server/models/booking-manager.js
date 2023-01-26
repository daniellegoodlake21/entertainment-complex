import dbConnection from "./db-connection.js";
import BookingSnackManager from "./booking-snack-manager.js";
class BookingManager
{
    constructor(userId)
    {
        this.userId = userId;
    }

        
    /* Get all relevant booking data */
    async getBookings(confirmed)
    {
        let bookingConfirmed = confirmed ? 1 : 0; // convert true/false to MySQL's TINYINT format
        let sql = "SELECT bookings.booking_id, bookable_sessions.session_id, time, slots_remaining, adult_price, child_price, number_of_adults, number_of_children, date, bookable_sessions.activity FROM bookings, bookable_sessions WHERE bookable_sessions.session_id = bookings.session_id AND bookings.user_id = " + this.userId + " AND bookings.confirmed = " + bookingConfirmed + ";";
        try
        {
            let results = await dbConnection.runQuery(sql);
            let bookings = [];
            for (let i = 0; i < results.length; i++)
            {
                // snacks are retrieved separately in Basket.js and MyAccount.js for each booking ID so they are not handled here
                let booking = {
                    bookingId: results[i].booking_id,
                    sessionId: results[i].session_id,
                    time: results[i].time,
                    slotsRemaining: results[i].slots_remaining,
                    adultPrice: results[i].adult_price,
                    childPrice: results[i].child_price,
                    date: results[i].date,
                    activity: results[i].activity,
                    adults: results[i].number_of_adults,
                    children: results[i].number_of_children
                }
                bookings.push(booking);
            }
            return {result : "success", bookings};
        }
        catch (err)
        {
            console.log(err);
            return {result : "error"};
        }
    }

    /* Confirm Booking only updates a booking as it is automatically saved to basket on basket page load 
    when the user is logged in */
    async confirmBookings()
    {
        let sql = "UPDATE bookings, bookable_sessions SET confirmed = 1, slots_remaining = (slots_remaining-(bookings.number_of_adults + bookings.number_of_children)) WHERE user_id = " + this.userId + " AND bookable_sessions.session_id = bookings.session_id;";
        try
        {
            await dbConnection.runQuery(sql);        
            return {result: "success"};
        }
        catch (err)
        {
            console.log(err);
            return {result: "error"};
        }
    }

    /* If the basket page is reloaded it will insert a new basket booking, but only if the exact booking does not already exist as a basket item.
    It doesn't matter if it exists as confirmed, the user may well have booked the exact same fields for a session on a past date.
    (Date is not stored in bookings, rather the bookable session it is linked to). */
    async bookingNotInBasket(booking)
    {
        let sql = "SELECT user_id, number_of_adults, number_of_children, activity, confirmed FROM bookings WHERE user_id = " + this.userId + " AND number_of_adults = " + booking.adults + " AND number_of_children = " + booking.children + " AND activity = '" + booking.activity +  "' AND confirmed = 0;";
        try
        {
            let results = await dbConnection.runQuery(sql);
            if (results.length > 0)
            {
                return false;
            }
            else
            {
                return true;
            }
        }
        catch (err)
        {
            console.log(err);
            // return false because the bookings should not be saved in the case of an error
            return false;
        }
    }

    /* Save bookings but only as in-basket bookings, not confirmed bookings.
    As the Basket.js requests this automatically on load (provided the user is logged in) there should
    never be a need to save a booking in its confirmed state, rather, it will only ever need to be updated
    (implemented in confirmBookings method) */
    async saveBookingsToBasket(bookings)
    {
        for (let i = 0; i < bookings.length; i++)
        {
            if (await this.bookingNotInBasket(bookings[i]))
            {
                let booking = bookings[i];
                let sql = "INSERT INTO bookings (user_id, number_of_adults, number_of_children, activity, confirmed, session_id) VALUES (" + this.userId +" ," + booking.adults + ", " + booking.children + ", '" + booking.activity + "', 0, " + booking.sessionId + ");";
                try
                {
                    let result = await dbConnection.runQuery(sql);
                    console.log(result);
                    let snackManager = new BookingSnackManager();
                    for (let j = 0; j < booking.snackData.length; j++)
                    {
                        let snack = booking.snackData[j];
                        await snackManager.saveSnackBookingLink(result.insertId, snack.snackId, snack.snackQuantity);
                    }
                    return {result: "success"};
                }
                catch (err)
                {
                    console.log(err);
                    return {result: "error"};
                } 
            }
        }
        return {"result": "success"};
    }
}
export default BookingManager;