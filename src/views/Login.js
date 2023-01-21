import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";
import $ from "jquery";
import { useNavigate } from "react-router-dom";

async function loginUser(user)
{ 
    return fetch('http://localhost:3001/login',
    {
        method: 'POST',
        headers:
        {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    }).catch((err) => console.log(err)).then(data => data.json());
}
export default function Login({setToken})
{
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const navigate = useNavigate();
    const handleSubmit = async e =>
    {

        let confirmedEmail = $("#email")[0].value;
        let confirmedPassword = $("#password")[0].value;
        e.preventDefault();
        const res = await loginUser({confirmedEmail, confirmedPassword});
        let result = res.result;
        if (result === "success")
        {
            setToken(res.token);
            $(".invalid-message").attr("hidden", "true");
            navigate('/my-account');
        }
        else
        {
            if (result === "incorrect")
            {
                $(".invalid-message").text("Incorrect password.");
            }
            else if (result === "doesNotExist")
            {
                $(".invalid-message").text("Sorry, a user with this email does not exist. Please check your input and try again.");
            }
            else if (result === "error")
            {
                (".invalid-message").text("There was a problem when logging in to your account.");
            }  
            $(".invalid-message").removeAttr("hidden");   
        }

    }
    return (
        <div>
            
            <h1 className="title text-light central-header">Login</h1>
            <form onSubmit={handleSubmit} className="login-form">
                <div>
                    <label htmlFor="email">Email Address:</label>
                    <br/>
                    <input onChange={setEmail} type="email" id="email" name="email" className="form-control form-control-rounded" required autoComplete="email"/>
                </div>
                <br/>
                <div>
                    <label htmlFor="password">Password:</label>
                    <br/>
                    <input onChange={setPassword} type="password" id="password" name="password" className="form-control form-control-rounded" required autoComplete="current-password"/>
                    <br/>
                </div>
                <br/>
                <p className="invalid-message" hidden></p>
                <input type="submit" name="btn-login" className="btn btn-lg btn-light form-control form-control-rounded" value="Log In"/>
            </form>
        </div>);
}
