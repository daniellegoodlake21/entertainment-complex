import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";
import $ from "jquery";
import useToken from "../components/useToken.js";
import { useNavigate } from "react-router-dom";

async function registerUser(user)
{
    return fetch('http://localhost:3001/register',
    {
        method: 'POST',
        headers:
        {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    }).catch((err) => console.log(err)).then(data => data.json())
}

export default function Register({setToken})
{
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const navigate = useNavigate();
    
    const validatePassword = () =>
    {
      let password = $("#password")[0].value;
      if (password.length >= 8)
      {
        const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
        let containsNumber = false;
        for (let i = 0; i < numbers.length; i++)
        {
          if (password.includes(numbers[i]))
          {
            containsNumber = true;
          }
        }
        if (containsNumber)
        {
          let containsLowercaseLetter = false;
          for (let i = 0; i < password.length; i++)
          {
            if (password.charAt(i).match(/[a-z]/))
            {
              containsLowercaseLetter = true;
            }
          }
          if (containsLowercaseLetter)
          {
            for (let i = 0; i < password.length; i++)
            {
              if (password.charAt(i).match(/[A-Z]/))
              {
                // if all checks are passed (including having one uppercase letter) then the password is valid
                return true;
              }
            }
          }
        }
      }
      return false;
    }
    const handleInputChange = async e =>
    {
        const setChange = async () =>
        {
          switch(e.target.name)
          {
            case "email":
              setEmail(e.target.value);
              break;
            case "password":
              setPassword(e.target.value);
              break;
            case "confirmPassword":
              setConfirmPassword(e.target.value);
              break;
            default:
              break;
          }
        }

        await setChange();
        // check whether password and confirm password values match
        let password = $("#password")[0].value;
        let confirmPassword = $("#confirmPassword")[0].value;
        if (password.length > 0)
        {
          if (password !== confirmPassword)
          {
            $(".invalid-message").removeAttr("hidden");
            $(".invalid-message").text("Passwords do not match.");

          }
          else if (!validatePassword())
          {
            $(".invalid-message").removeAttr("hidden");
            $(".invalid-message").text("Password must contain at least 1 uppercase letter, 1 lowercase letter and 1 number.")
          
          }
          else
          {
            $(".invalid-message").attr("hidden", "true");
          }
        }
        
    }
    const handleSubmit = async e =>
    {
        e.preventDefault();
        if (!validatePassword())
        {
          return;
        }
        else if (password !== confirmPassword)
        {
          return;
        }
        else
        {
          let confirmedEmail = $("#email")[0].value;
          let confirmedPassword = $("#password")[0].value;
          const res = await registerUser({confirmedEmail, confirmedPassword});
          if (res.result === "success")
          {
            
              setToken(res.token);
              $(".invalid-message").attr("hidden", "true");
              navigate("/my-account");
          }
          else if (res.result === "error")
          {
              $(".invalid-message").text("There was a problem trying to register you an account.");
              $(".invalid-message").removeAttr("hidden");
          }
          else if (res.result === "alreadyExists")
          {
              $(".invalid-message").text("A user with this email address already exists.");
              $(".invalid-message").removeAttr("hidden");
          }
        }
  }
  return (
  <div>
      <h1 className="title text-light central-header">Register</h1>
      <form onSubmit={handleSubmit} className="register-form">
          <div>
              <label htmlFor="email">Email Address:</label>
              <br/>
              <input onKeyUp={(e) => handleInputChange(e)} type="email" id="email" name="email" className="form-control form-control-rounded" required autoComplete="email"/>
          </div>
          <br/>
          <div>
              <label htmlFor="password">Password:</label>
              <br/>
              <input onKeyUp={(e) => handleInputChange(e)}  type="password" id="password" name="password" className="form-control form-control-rounded" required autoComplete="new-password"/>
              <br/>
          </div>
          <div>
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <br/>
              <input onKeyUp={(e) => handleInputChange(e)} type="password" id="confirmPassword" name="confirmPassword" className="form-control form-control-rounded" required/>
              <br/>
          </div>
          <br/>
          <p className="invalid-message" hidden></p>
          <input type="submit" name="btn-register" className="btn btn-lg btn-light form-control form-control-rounded" value="Register"/>
      </form>
  </div>);
}