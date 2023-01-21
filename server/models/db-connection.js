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

    runQuery(sql)
    {
        return new Promise(async (resolve, reject) =>
        {
            await this.connect();
            this.connection.query(sql, (error, result) =>
            {
                if (error)
                {
                    console.log(error.message);
                    return reject(error);
                }
                return resolve(result);
            });
        });
    }
}

const dbConnection = new DatabaseConnection();
export default dbConnection;