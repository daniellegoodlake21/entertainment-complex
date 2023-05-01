
import dbConnection from "./db-connection.js";

class SeatingManager
{
    constructor(activity)
    {
        this.activity = activity;
    }

    async getBookedSeats(bookableSessionId)
    {
        let sql = "SELECT " + this.activity + "_seat_id FROM bookings_" + this.activity + "_seats_links WHERE booking_id = " +  bookableSessionId + ";";
        try
        {
            let results = await dbConnection.runQuery(sql);
            let bookedSeats = [];
            for (let i = 0; i < results.length; i++)
            {
                if (this.activity === "cinema")
                {
                    bookedSeats.push(results[i].cinema_seat_id);
                }
                else
                {
                    bookedSeats.push(results[i].theatre_seat_id);
                }
            }
            return bookedSeats;
        }
        catch (err)
        {
            console.log(err);
            return [];
        }
    }

    async getSeatsForBooking(bookingId)
    {
        let sql = "SELECT " + this.activity + "_seat_id FROM bookings_" + this.activity + "_seats_links LEFT JOIN bookable_sessions ON bookable_sessions.session_id = bookings_" + this.activity + "_seats_links.booking_id INNER JOIN bookings ON bookings.session_id = bookable_sessions.session_id AND bookings.booking_id = " +  bookingId + ";";
        try
        {
            let results = await dbConnection.runQuery(sql);
            let bookingSeats = [];
            for (let i = 0; i < results.length; i++)
            {
                if (this.activity === "cinema")
                {
                    bookingSeats.push(results[i].cinema_seat_id);
                }
                else
                {
                    bookingSeats.push(results[i].theatre_seat_id);
                }
            }
            return bookingSeats;
        }
        catch (err)
        {
            console.log(err);
            return [];
        }
    }

    async getSeats(bookableSessionId = null)
    {
        let sql = "SELECT * FROM " + this.activity + "_seats;";
        try
        {
            let results = await dbConnection.runQuery(sql);
            let seats = [];
            let bookedSeats = [];
            if (bookableSessionId)
            {
                bookedSeats = await this.getBookedSeats(bookableSessionId);
            }
            for (let i = 0; i < results.length; i++)
            {
                let available = !bookedSeats.includes(results[i].seat_id);
                if (this.activity === "cinema")
                {
                    let seat = {
                        seatId: results[i].seat_id,
                        premium: results[i].premium,
                        available: available
                    }
                    seats.push(seat);
                }
            }
            return {result: "success", seats};
        }
        catch (err)
        {
            console.log(err);
            return {result: "error"};
        }
    }
    
    async reserveSeats(bookingId, seatIds)
    {
        for (let i = 0; i < seatIds.length; i++)
        {
            let sql = "INSERT INTO bookings_" + this.activity + "_seats_links VALUES (" + bookingId + ", '" + seatIds[i] + "');";
            try
            {
                await dbConnection.runQuery(sql);
            }
            catch
            {
                return false;
            }
        }
        return true;        
    }
}

export default SeatingManager;