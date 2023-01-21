import dbConnection from "./db-connection.js";

class BookingSnackManager
{
    constructor(activity)
    {
        this.activity = activity;
    }

    // gets all the available snacks for a specific activity
    async getSnacks()
    {
        let sql = "SELECT * FROM booking_snacks WHERE activity = '" + this.activity +"';";
        try
        {
            let results = await dbConnection.runQuery(sql);
            dbConnection.disconnect();
            let snacks = [];
            for (let i = 0; i < results.length; i++)
            {
                let snack = {
                    snackId : results[i].snack_id,
                    snackName : results[i].snack_name,
                    snackPrice : results[i].snack_price,
                    snackImageRef : results[i].snack_image_ref
                };
                snacks.push(snack);
            }
            return {"result": "success", snacks};

        }
        catch
        {
            return {"result": "error"};
        }
    }

}

export default BookingSnackManager;