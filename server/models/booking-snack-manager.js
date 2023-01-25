import dbConnection from "./db-connection.js";

class BookingSnackManager
{
    constructor(activity = null)
    {
        this.activity = activity;
    }

    // get snack name and price based on id
    async getSnackDetails(snackId)
    {
        let sql = "SELECT snack_id, snack_name, snack_price FROM booking_snacks WHERE snack_id = " + String(snackId) + ";";
        try
        {
            let results = await dbConnection.runQuery(sql);        
            let snack = {
                snackId: results[0].snack_id,
                snackName: results[0].snack_name,
                snackPrice: results[0].snack_price
            }
            return {"result": "success", snack};
        }
        catch (err)
        {
            return {"result": "error"};
        }
    }
    // gets all the available snacks for a specific activity
    async getSnacks()
    {
        let sql = "SELECT * FROM booking_snacks WHERE activity = '" + this.activity +"';";
        try
        {
            let results = await dbConnection.runQuery(sql);
            
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