import { createConnection } from 'mysql';

class DatabaseConnection
{
    constructor()
    {
        this.connection = null;
    }

    connect()
    {
        this.connection = createConnection({
            host: "localhost",
            user: "Danielle",
            password: "Flame21!2005"
        });
        this.connection.connect(function(error)
        {
            if (error) throw error;
            console.log("Connected to database!");
        });
    }  
    
    disconnect()
    {
        this.connection.end();
        console.log("Disconnected");
    }

    runQuery(sql)
    {
        this.connection.createQuery(sql, (error, results, fields) =>
        {
            if (error)
            {
                console.log("Error processing SQL query. SQL: " + sql + "\n" + "Error:" + error.message);
                return;
            }
            else
            {
                return results;
            }
        });
    }
}

dbConnection = new DatabaseConnection();