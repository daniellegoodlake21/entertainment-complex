import React, {Component} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

async function testTokenValidation()
{
  const token = localStorage.getItem("token");
  return fetch('http://localhost:3001/my-account',
  {
      method: 'POST',
      headers:
      {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify({"token" : token})
  }).then(data => data.json());
}

export default function MyAccount()
{

  const handleSubmit = async (e) =>
  {
    e.preventDefault();
    let res = await testTokenValidation();
    if (res.result === "success")
    {
      alert("Validation successful!")
    }
    else if (res.result === "loginRequired")
    {
      alert("Login required");
    }
  }
  return (<div className="container">
        <h1 className="title text-light">Test token validation?</h1>
        <br/>
        <form onSubmit={handleSubmit} className="logout-form">
            <input type="submit" name="btn-logout" className="btn btn-lg btn-light form-control form-control-rounded" value="Test"/>
        </form>
    </div>);
}