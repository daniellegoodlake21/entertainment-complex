
import dbConnection from "./db-connection.js";

class SeatingManager
{
    constructor(activity)
    {
        this.activity = activity;
    }

    async getSeats()
    {
        let sql = "SELECT * FROM " + this.activity + "_seats;";
        try
        {
            let results = await dbConnection.runQuery(sql);
            let seats = [];
            for (let i = 0; i < results.length; i++)
            {
                if (this.activity === "cinema")
                {
                    let seat = {
                        seatId: results[i].seat_id,
                        premium: results[i].premium,
                        available: results[i].available
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
}

export default SeatingManager;