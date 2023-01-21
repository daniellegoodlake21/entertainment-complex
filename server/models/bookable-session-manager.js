import dbConnection from "./db-connection.js";

class BookableSessionManager
{
    constructor(activity, date)
    {
        this.activity = activity;
        this.date = date;
    }
    
    async getBookableSessions()
    {
        let connection = await dbConnection.connect();
        let sql = "SELECT session_id, time, slots_remaining, child_price, adult_price FROM bookable_sessions WHERE activity = '" + this.activity + "' AND date = DATE('" + this.date + "') AND slots_remaining > 0;";
        let promise = () => 
        {
            return new Promise((resolve, reject) =>
            {
                connection.query(sql, (error, result) =>
                {
                    if (error)
                    {
                        return reject(error);
                    }
                    return resolve(result);
                });
            });
        }
        try
        {
            let results = await promise();
            dbConnection.disconnect();
            let sessions = [];
            for (let i = 0; i < results.length; i++)
            {
                let session = 
                {
                    session_id: results[i].session_id,
                    time : results[i].time,
                    slotsRemaining : results[i].slots_remaining,
                    childPrice : results[i].child_price,
                    adultPrice : results[i].adult_price
                };
  
                sessions.push(session);
            }
            return {"result" : "success", sessions};
        }
        catch (err)
        {
            console.log(err.message);
            return {"result": "error"};
        }
    }
}
export default BookableSessionManager;