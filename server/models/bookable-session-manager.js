import dbConnection from "./db-connection.js";

class BookableSessionManager
{
    constructor(activity=null, date=null)
    {
        this.activity = activity;
        this.date = date;
    }
    
    /* Get a single bookable session by its id */
    async getBookableSessionFromBasket(sessionId)
    {
        let sql = "SELECT session_id, time, slots_remaining, child_price, adult_price, date FROM bookable_sessions WHERE session_id = " + sessionId + ";";
        try
        {
            let results = await dbConnection.runQuery(sql);
            let session = {
                sessionId: results[0].session_id,
                time : results[0].time,
                date: results[0].date,
                slotsRemaining : results[0].slots_remaining,
                childPrice : results[0].child_price,
                adultPrice : results[0].adult_price
            };
            return {result : "success", session};
        }
        catch (err)
        {
            console.log(err);
            return {result: "error"};
        }
    }

    /* get all bookable sessions of the specified activity type and date */
    async getBookableSessions()
    {
        let sql = "SELECT session_id, time, slots_remaining, child_price, adult_price FROM bookable_sessions WHERE activity = '" + this.activity + "' AND date = DATE('" + this.date + "') AND slots_remaining > 0 ORDER BY time ASC;";
        try
        {
            let results = await dbConnection.runQuery(sql);
            
            let sessions = [];
            for (let i = 0; i < results.length; i++)
            {
                let session = 
                {
                    sessionId: results[i].session_id,
                    time : results[i].time,
                    slotsRemaining : results[i].slots_remaining,
                    childPrice : results[i].child_price,
                    adultPrice : results[i].adult_price
                };
  
                sessions.push(session);
            }
            return {result : "success", sessions};
        }
        catch (err)
        {
            console.log(err);
            return {result: "error"};
        }
    }

    /* update a bookable session to re-add freed up slots when a booking was deleted */
    async increaseSlots(slotsToAdd, bookingId)
    {
        let sql = "UPDATE bookable_sessions, bookings SET slots_remaining = (slots_remaining + " + slotsToAdd + ") WHERE bookable_sessions.session_id = bookings.session_id AND bookings.booking_id = " + bookingId + ";";
        try
        {
            await dbConnection.runQuery(sql);
            return true;
        }
        catch (err)
        {
            console.log(err);
            return false;
        }
    }
}
export default BookableSessionManager;