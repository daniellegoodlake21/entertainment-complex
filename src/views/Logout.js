import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";
import { useNavigate } from "react-router-dom";
function Logout({setToken})
{
    const navigate = useNavigate();

    const handleSubmit = (e) =>
    {
        e.preventDefault();
        setToken();
        navigate("/");
        localStorage.clear();
    }
    
    return (<div className="container">
                <h1 className="title text-light">Do you want to logout?</h1>
                <br/>
                <form onSubmit={handleSubmit} className="logout-form">
                    <input type="submit" name="btn-logout" className="btn btn-lg btn-light form-control form-control-rounded" value="Log Out"/>
                </form>
            </div>);
}
export default Logout;