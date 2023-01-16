import React, {Component} from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";
class Login extends Component
{
  render()
    {
        return (
        <div>
            <h1 class="title text-light central-header">Login</h1>
            <form action="/login" method="POST" class="login-form">
                <div>
                    <label for="email">Email Address:</label>
                    <br/>
                    <input type="email" id="email" name="email" class="form-control form-control-rounded" required/>
                </div>
                <br/>
                <div>
                    <label for="password">Password:</label>
                    <br/>
                    <input type="password" id="password" name="password" class="form-control form-control-rounded" required/>
                    <br/>
                </div>
                <br/>
                <p class="invalid-message" hidden>Sorry, a user with this email and password does not exist. Please try again.</p>
                <input type="submit" name="btn-login" class="btn btn-lg btn-light form-control form-control-rounded" value="Log In"/>
            </form>
        </div>);
    };
}
export default Login;