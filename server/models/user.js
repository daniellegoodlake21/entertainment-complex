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

    async login()
    {
        let sql = "SELECT * FROM users WHERE email = '" + this.email + "';";
        try
        {
            let result = await dbConnection.runQuery(sql);
            if (result.length === 0)
            {
                return {result: "doesNotExist"};
            }
            let user = result[0];
            
            this.id = user.user_id;
            this.email = user.email;
            this.passwordHash = user.password_hash;
            if (!await this.verifyPassword())
            {
                return {result: "incorrect"};
            }
            else
            {              
                return {result : "success", "userId" : this.id};
            }
        }
        catch (err)
        {
            console.log(err);
            return {result : "error"};
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

                return {result : "error"};
            }
            else
            {
                return {result : "success", "userId" : this.id};  
            }
        }
        catch (err)
        {
            if (err.code === 'ER_DUP_ENTRY') 
            {
                return {result : "alreadyExists"}; // user with this email already exists
            }
            else
            {
                return {result : "error"};
            }
        }
    }
}

export default User;