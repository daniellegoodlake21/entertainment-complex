import { Outlet, Link } from "react-router-dom";
import React, {Component} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Nav, Button } from 'react-bootstrap';
import "./styles.css";

import $ from "jquery";

class GuestLayout extends Component
{
    toggleMenu()
    {
        $("#navbar-content").toggleClass("show");
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
                            <Link to="/" onClick={this.toggleMenu} className="nav-link text-light">Home</Link>
                        </li>
                        <li className="navbar-item my-nav-item col-sd-2 list-unstyled">
                            <Link to="/login"  onClick={this.toggleMenu} className="nav-link text-light">Login</Link>
                        </li>
                        <li className="navbar-item my-nav-item col-sd-2 list-unstyled">
                            <Link to="/register" onClick={this.toggleMenu} className="nav-link text-light">Register</Link>
                        </li>
                        <li className="navbar-item my-nav-item col-sd-2 list-unstyled">
                            <Link to="/ice-skating"  onClick={this.toggleMenu} className="nav-link text-light">Ice Skating</Link>
                        </li>
                        <li className="navbar-item my-nav-item col-sd-2 list-unstyled">
                            <Link to="/theatre"  onClick={this.toggleMenu} className="nav-link text-light">Theatre</Link>
                        </li>
                        <li className="navbar-item my-nav-item col-sd-2 list-unstyled">
                            <Link to="/cinema" onClick={this.toggleMenu} className="nav-link text-light">Cinema</Link>
                        </li>
                        <li className="navbar-item my-nav-item col-sd-2 list-unstyled">
                            <Link to="/bowling"  onClick={this.toggleMenu} className="nav-link text-light">Bowling</Link>
                        </li>
                    </ul>
                </div>
            </Nav>
        <Outlet/>
    </>);
    }
}
export default GuestLayout;