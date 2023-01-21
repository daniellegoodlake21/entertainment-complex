import { createConnection } from 'mysql';
import {config} from 'dotenv';
config({path: "./server/.env"});
class DatabaseConnection
{
    constructor()
    {
        this.connection = null;
    }

    async connect()
    {
        this.connection = createConnection({
            host: "localhost",
            user: "Danielle",
            database: "entertainment-complex",
            password: process.env.DB_PASS
        });
        this.connection.connect(function(error)
        {
            if (error) throw error;
            console.log("Connected to database!");
        });
        return this.connection;
    }  
    
    disconnect()
    {
        this.connection.end();
        console.log("Disconnected");
    }
}

const dbConnection = new DatabaseConnection();
export default dbConnection;