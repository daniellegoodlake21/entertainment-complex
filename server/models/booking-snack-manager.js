import dbConnection from "./db-connection.js";

class BookingSnackManager
{
    constructor(activity = null)
    {
        this.activity = activity;
    }

    // get snack names, prices and quantities based on linked booking id
    async getLinkedSnacksDetails(bookingId, userId)
    {
        let sql = "SELECT booking_snacks.snack_id, snack_name, snack_price, quantity FROM booking_snacks, bookings_snacks_links, bookings WHERE bookings_snacks_links.booking_id = " + bookingId + " AND booking_snacks.snack_id = bookings_snacks_links.snack_id AND bookings.user_id = " + userId + " AND bookings.booking_id = bookings_snacks_links.booking_id;";
        try
        {
            let results = await dbConnection.runQuery(sql);
            let snackData = [];
            for (let i = 0; i < results.length; i++)
            {
                let snack = {
                    snackId: results[i].snack_id,
                    snackName: results[i].snack_name,
                    snackPrice: results[i].snack_price,
                    snackQuantity: results[i].quantity
                }
                snackData.push(snack);
            }

            return {result: "success", snackData};
        }
        catch (err)
        {
            return {result: "error"};
        }
    }
    // get snack name and price based on id
    async getSnackDetails(snackId)
    {
        let sql = "SELECT snack_id, snack_name, snack_price FROM booking_snacks WHERE snack_id = " + snackId + ";";
        try
        {
            let results = await dbConnection.runQuery(sql);        
            let snack = {
                snackId: results[0].snack_id,
                snackName: results[0].snack_name,
                snackPrice: results[0].snack_price
            }
            return {result: "success", snack};
        }
        catch (err)
        {
            return {result: "error"};
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
            return {result: "success", snacks};

        }
        catch
        {
            return {result: "error"};
        }
    }
    /* Check snack booking link not already in basket. */
    async snackNotInBasket(bookingId, snackId)
    {
        let sql = "SELECT booking_id, snack_id FROM bookings_snacks_links WHERE booking_id = " + bookingId + " AND snack_id = " + snackId + ";";
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
            // return false because the snack booking links should not be saved in the case of an error
            return false;
        }
    }
    /* Insert snack booking link into table */
    async saveSnackBookingLink(bookingId, snackId, quantity)
    {
        if (await this.snackNotInBasket(bookingId, snackId))
        {
            let sql = "INSERT INTO bookings_snacks_links VALUES (" + bookingId + ", " + snackId + ", " + quantity + ");";
            try
            {
                await dbConnection.runQuery(sql);
                return {result: "success"};
            }
            catch
            {
                return {result: "error"};
            }      
        }
        else
        {
            return {result: "success"};
        }

    }

}

export default BookingSnackManager;