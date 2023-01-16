import { Outlet, Link } from "react-router-dom";
import React, {Component, useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import { Nav, Button } from 'react-bootstrap';
import "./styles.css";


class Layout extends Component
{
    toggleMenu()
    {
        document.getElementById("navbar-content").classList.toggle("show");
    }
    render ()
    {
        return (
        <>
            <Nav className="navbar navbar-light custom-navbar navbar-expand-lg">
                <h1 className="nav-brand text-light">Seafront Entertainment Complex</h1>
                <Button className="navbar-toggler hamburger" type="button" onClick={this.toggleMenu} data-toggle="collapse" data-target="#navbar-content" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Navigation toggle">
                    
                    <span className="navbar-toggler-icon navbar-light"></span>
                </Button>        
                <div id="navbar-content" className="collapse navbar-collapse row">
                    <ul className="navbar-nav ms-auto">
                        <li className="navbar-item my-nav-item col-sd-2 list-unstyled">
                            <Link to="/" className="nav-link text-light">Home</Link>
                        </li>
                        <li className="navbar-item my-nav-item col-sd-2 list-unstyled">
                            <Link to="/login"className="nav-link text-light">Login</Link>
                        </li>
                        <li className="navbar-item my-nav-item col-sd-2 list-unstyled">
                            <Link to="/register" className="nav-link text-light">Register</Link>
                        </li>
                        <li className="navbar-item my-nav-item col-sd-2 list-unstyled">
                            <Link to="/my-account" className="nav-link text-light">My Account</Link>
                        </li>
                        <li className="navbar-item my-nav-item col-sd-2 list-unstyled">
                            <Link to="/basket" className="nav-link text-light">Basket</Link>
                        </li>
                        <li className="navbar-item my-nav-item col-sd-2 list-unstyled">
                            <Link to="/ice-skating" className="nav-link text-light">Ice Skating</Link>
                        </li>
                        <li className="navbar-item my-nav-item col-sd-2 list-unstyled">
                            <Link to="/theatre" className="nav-link text-light">Theatre</Link>
                        </li>
                        <li className="navbar-item my-nav-item col-sd-2 list-unstyled">
                            <Link to="/cinema" className="nav-link text-light">Cinema</Link>
                        </li>
                        <li className="navbar-item my-nav-item col-sd-2 list-unstyled">
                            <Link to="/bowling" className="nav-link text-light">Bowling</Link>
                        </li>
                    </ul>
                </div>
            </Nav>
        <Outlet/>
    </>);
    }
}
export default Layout;