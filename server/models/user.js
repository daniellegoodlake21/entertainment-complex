import { randomBytes } from 'crypto';
import dbConnection from './db-connection.js';
import bcrypt from 'bcryptjs';

class User
{
    constructor(email, password)
    {
        this.id = -1;
        this.email = email;
        this.password = password;
        this.passwordHash = this.hashPassword();
        this.session_id = null;
    }



    hashPassword()
    {
        let salt = bcrypt.genSaltSync();
        let hashedPassword = bcrypt.hashSync(this.password, salt);
        return hashedPassword;
    }
    
    // returns a boolean
    async verifyPassword()
    {
        return bcrypt.compare(this.password, this.passwordHash);
    }



    // gets the pre-existing user session from the database
    async getUserSession()
    {
        let sql = "SELECT session_id FROM sessions WHERE user_id = " + this.id + ";";
        let connection = await dbConnection.connect();
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
        let result = await promise();
        try
        {
            this.session_id = result[0].session_id;
            dbConnection.disconnect();
        }
        catch
        {
        }
    }

    // creates a new user session in the database
    async generateUserSession()
    {
        this.session_id = randomBytes(16).toString('base64');
        let sql = "INSERT INTO sessions VALUES ('" + this.session_id + "', " + this.id + ");";
        let connection = await dbConnection.connect();
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
        promise();
        dbConnection.disconnect();
    }

    async login()
    {
        let sql = "SELECT * FROM users WHERE email = '" + this.email + "';";
        let connection = await dbConnection.connect();
        let promise = () => 
        {
            return new Promise((resolve, reject) =>
            {
                connection.query(sql, (error, result) =>
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
        try
        {
            let result = await promise();
            if (result.length === 0)
            {
                return "doesNotExist";
            }
            let user = result[0];
            dbConnection.disconnect();
            this.id = user.user_id;
            this.email = user.email;
            this.passwordHash = user.password_hash;
            if (!await this.verifyPassword())
            {
                return "incorrect";
            }
            else
            {
                await this.getUserSession();
                if (!this.session_id)
                {
                    return "error";
                }
                else
                {
                    return "success";
                }
            }
        }
        catch (err)
        {
            return "error";
        }
    }

    async register()
    {
        let sql = "INSERT INTO users (email, password_hash) VALUES ('" + this.email + "', '" + this.passwordHash + "');";
        let connection = await dbConnection.connect();
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
            let result = await promise();
            this.id = result.insertId;
            dbConnection.disconnect();
            if (this.id === -1)
            {

                return "error";
            }
            else
            {
                await this.generateUserSession();
                return "success";  
            }
        }
        catch (err)
        {
            if (err.code === 'ER_DUP_ENTRY') 
            {
                return "alreadyExists"; // user with this email already exists
            }
            else
            {
                return "error";
            }
        }
    }
}

export default User;