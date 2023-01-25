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

        try
        {
            let result = await dbConnection.runQuery(sql);
            this.session_id = result[0].session_id;
            
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
        try
        {
            await dbConnection.runQuery(sql);
            
        }
        catch
        {
            console.log("Error generating user session");
        }
        
    }

    async login()
    {
        let sql = "SELECT * FROM users WHERE email = '" + this.email + "';";
        try
        {
            let result = await dbConnection.runQuery(sql);
            if (result.length === 0)
            {
                return "doesNotExist";
            }
            let user = result[0];
            
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
            console.log(err);
            return "error";
        }
    }

    async register()
    {
        let sql = "INSERT INTO users (email, password_hash) VALUES ('" + this.email + "', '" + this.passwordHash + "');";
        try
        {
            let result = await dbConnection.runQuery(sql);
            this.id = result.insertId;
            
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