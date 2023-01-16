import { randomBytes } from 'crypto';
class User
{
    constructor(email, passwordHash)
    {
        this.id = -1;
        this.email = email;
        this.passwordHash = passwordHash;
    }

    getId()
    {
        return this.id;
    }

    getSessionCookie() 
    {
        let cookieName = "session_id";
        let cookie = {};
        document.cookie.split(';').forEach(function(element) {
          let [key,value] = element.split('=');
          cookie[key.trim()] = value;
        })
        return cookie[cookieName];
    }

    generateUserSession()
    {
        let session_id = randomBytes(16).toString('base64');
        let sql = "INSERT INTO sessions VALUES (" + this.id + "," + session_id + ");";
        let result = dbConnection.runQuery(sql);
        if (!result)
        {
            // if there has been an error then return null
            return;
        }
        return session_id;
    }

    login()
    {
        let sql = "SELECT * FROM users WHERE email = " + this.email + " AND password_hash = " + this.passwordHash + ";";s
        let users = dbConnection.runQuery(sql);
        // if users is null then there was an error (handled in runQuery) so only proceed if successful
        if (!users)
        {
            return false;
        }
        else if (length(users) === 0)
        {
        }
        else if (length(users) > 1)
        {
        }
        else
        {
            let user = users[0];
            this.id = user.user_id;
            this.email = user.email;
            this.passwordHash = user.passwordHash;
            sql = "SELECT session_id FROM sessions WHERE user_id = " + this.id + ";";
            let session_ids = dbConnection.runQuery(sql);
            let session_id;
            if (!session_ids)
            {
                return false;
            }
            else if (length(session_ids) === 0 || length(session_ids > 1))
            {
                // create a session for the user. However, the session should theoretically always exist if the database has not been modified
                session_id = this.generateUserSession();
                if (!session_id)
                {
                    return false;
                }
            }
            else
            {
                session_id = session_ids[0].session_id;
            }
            document.cookie +=  "session_id=" + session_id;
            return true;
        }

    }
    
    register()
    {

    }
}