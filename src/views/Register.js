import React, {Component} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";
import $ from "jquery";
import axios from "axios";
import PropTypes from 'prop-types';
import useToken from "../components/useToken.js";

class Register extends Component
{
    constructor(props) 
    {
        super(props);

        this.state = {
            email: "",
            password: "",
            confirmPassword: ""
        };
    }
    validatePassword()
    {
      let password = this.state.password;
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
    handleInputChange = e =>
    {
        this.setState({[e.target.name]: e.target.value}, () =>
        {
          // check whether password and confirm password values match
          let {password, confirmPassword} = this.state;
          if (password.length > 0)
          {
            if (password !== confirmPassword)
            {
              $(".invalid-message").removeAttr("hidden");
              $(".invalid-message").text("Passwords do not match.");

            }
            else if (!this.validatePassword())
            {
              $(".invalid-message").removeAttr("hidden");
              $(".invalid-message").text("Password must contain at least 1 uppercase letter, 1 lowercase letter and 1 number.")
            
            }
            else
            {
              $(".invalid-message").attr("hidden", "true");
            }
          }
        });
        
    }
    handleSubmit = e =>
    {
        const {email, password, confirmPassword} = this.state;
        e.preventDefault();
        if (!this.validatePassword())
        {
          return;
        }
        else if (password !== confirmPassword)
        {
          return;
        }
        else
        {
          const user = { "email" : email, "password" : password };
          axios({
              url: "http://localhost:3000/register",
              method: "POST",
              data: user,
              }).catch(err => 
              {
                  console.log(err);
              }).then((res) => 
              {
                  if (res.data.result === "success")
                  {
                    
                     useToken().setToken(res.data.token);
                      //redirect("/my-account");
                  }
                  else if (res.data.result === "error")
                  {
                      $(".invalid-message").text("There was a problem trying to register you an account.");
                      $(".invalid-message").removeAttr("hidden");
                  }
                  else if (res.data.result === "alreadyExists")
                  {
                      $(".invalid-message").text("A user with this email address already exists.");
                      $(".invalid-message").removeAttr("hidden");
                  }
              });
          }
    }
    render()
    {
        return (
        <div>
            <h1 className="title text-light central-header">Register</h1>
            <form onSubmit={this.handleSubmit} className="register-form">
                <div>
                    <label htmlFor="email">Email Address:</label>
                    <br/>
                    <input onKeyUp={this.handleInputChange} type="email" id="email" name="email" className="form-control form-control-rounded" required autoComplete="email"/>
                </div>
                <br/>
                <div>
                    <label htmlFor="password">Password:</label>
                    <br/>
                    <input onKeyUp={this.handleInputChange}  type="password" id="password" name="password" className="form-control form-control-rounded" required autoComplete="new-password"/>
                    <br/>
                </div>
                <div>
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <br/>
                    <input onKeyUp={this.handleInputChange} type="password" id="confirmPassword" name="confirmPassword" className="form-control form-control-rounded" required/>
                    <br/>
                </div>
                <br/>
                <p className="invalid-message" hidden></p>
                <input type="submit" name="btn-register" className="btn btn-lg btn-light form-control form-control-rounded" value="Register"/>
            </form>
        </div>);
    }
}
export default Register;