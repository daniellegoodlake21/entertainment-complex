import { createConnection } from 'mysql';
import {config} from 'dotenv';
config();
class DatabaseConnection
{
    constructor()
    {
        this.connection = null;
    }

    async connect()
    {
        if (!this.connection)
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
            });  
        }

    }  
    
    disconnect()
    {
        if (this.connection)
        {
            this.connection.end();
            this.connection = null;
        }
    }
    runQuery(sql)
    {
        return new Promise(async (resolve, reject) =>
        {
            await this.connect();
            this.connection.query(sql, (error, result) =>
            {
                this.disconnect();
                if (error)
                {
                    console.log(error);
                    return reject(error);
                }
                return resolve(result);
            });
        });
    }
}

const dbConnection = new DatabaseConnection();
export default dbConnection;