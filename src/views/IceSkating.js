import React, {Component} from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";
class IceSkating extends Component
{
  render()
    {
        return (<div> 
          <form className="customize-booking-package-form" method="post" action="/ice-skating">
              <h1 className="title text-light central-header">Book an Ice Skating Session</h1>
              <div className="container-fluid">
                  <div className="row">
                      <div className="customize-booking-basics col-lg-6">
                          <h2>Basic Booking Details</h2>
                          <label htmlFor="booking-date">Select Date of Visit:</label>
                          <br/>
                          <input type="date" id="booking-date" required/>
                          <p className="invalid-message" hidden>Sorry, the date you have picked is invalid.<br/>Please pick a date between today and 14 days ahead of today.</p>
                          <div className="show-when-date-selected">
                              <br/>
                              <label htmlFor="number-of-attendees">Enter the number of people attending (max 8 per booking):</label>
                              <br/>
                              <select id="number-of-attendees">
                                  <option value="1">1</option>
                                  <option value="2">2</option>
                                  <option value="3">3</option>
                                  <option value="4">4</option>
                                  <option value="5">5</option>
                                  <option value="6">6</option>
                                  <option value="7">7</option>
                                  <option value="8">8</option>
                              </select>
                              <div className="booking-time-slots-section">
                                  <br/>
                                  <p>Pick a Time Slot:</p>
                                  <ul id="booking-time-slots-list">
                                      <div className="booking-time-slot-item">
                                          <h6 className="time-slot">12pm</h6>
                                          <p>Remaining Available Slots: <span className="slots-available">24</span></p>
                                          <p>Price Per Person:<br/>Adult: £<span className="adult-price">12</span><br/>Child: £<span className="child-price">10</span></p>
                                      </div>
                                      <div className="booking-time-slot-item selected">
                                          <h6 className="time-slot">2pm</h6>
                                          <p>Remaining Available Slots: <span className="slots-available">8</span></p>
                                          <p>Price Per Person:<br/>Adult: £<span className="adult-price">14</span><br/>Child: £<span className="child-price">12</span></p>
                                      </div>
                                  </ul>
                                  <p className="no-time-slots-message" hidden>Please select a date first.</p>
                              </div>
                          </div>
                      </div>
                      <div className="customize-booking-extras col-lg-6">
                          <h2>Booking Extras</h2>
                          <p>Add in some pre-ordered snacks for after your ice skating session! (Optional)</p>
                          <ul id="snacks-list" className="container-fluid">
                              <div className="row">
                                  <div className="snack-item col-lg-6">
                                      <h5>Slice of Cake</h5>      
                                      <img src="images/cake.png" width="100" height="100"  alt="Cake"/>
                                      <p>Price: £1.50</p>
                                      <label htmlFor="cake-quantity">Quantity:</label>
                                      <br/>
                                      <select id="cake-quantity">
                                          <option value="0">0</option>
                                          <option value="1">1</option>
                                          <option value="2">2</option>
                                          <option value="3">3</option>
                                          <option value="4">4</option>
                                          <option value="5">5</option>
                                          <option value="6">6</option>
                                          <option value="7">7</option>
                                          <option value="8">8</option>
                                      </select>
                                  </div>
                                  <div className="snack-item col-lg-6">
                                      <h5>Bottle of Juice</h5>
                                      <img src="images/juice.png" width="75" height="100" alt="Juice"/>
                                      <p>Price: £1</p>
                                      <label htmlFor="juice-quantity">Quantity:</label>
                                      <br/>
                                      <select id="juice-quantity">
                                          <option value="0">0</option>
                                          <option value="1">1</option>
                                          <option value="2">2</option>
                                          <option value="3">3</option>
                                          <option value="4">4</option>
                                          <option value="5">5</option>
                                          <option value="6">6</option>
                                          <option value="7">7</option>
                                          <option value="8">8</option>
                                      </select>
                                  </div>
                              </div>
                              <div className="row">
                                  <div className="snack-item col-lg-6">
                                      <h5>Ice Cream</h5>
                                      <img src="images/ice-cream.png" width="80" height="100" alt="Ice Cream"/>
                                      <p>Price: £2</p>
                                      <label htmlFor="ice-cream-quantity">Quantity:</label>
                                      <br/>
                                      <select id="ice-cream-quantity">
                                          <option value="0">0</option>
                                          <option value="1">1</option>
                                          <option value="2">2</option>
                                          <option value="3">3</option>
                                          <option value="4">4</option>
                                          <option value="5">5</option>
                                          <option value="6">6</option>
                                          <option value="7">7</option>
                                          <option value="8">8</option>
                                      </select>
                                  </div>
                                  <div className="snack-item col-lg-6">
                                      <h5>Chips</h5>
                                      <img src="images/fries.png" className="extra-padding" width="150" height="100" alt="Chips"/>
                                      <p>Price: £2.50</p>
                                      <label htmlFor="chips-quantity">Quantity:</label>
                                      <br/>
                                      <select id="chips-quantity">
                                          <option value="0">0</option>
                                          <option value="1">1</option>
                                          <option value="2">2</option>
                                          <option value="3">3</option>
                                          <option value="4">4</option>
                                          <option value="5">5</option>
                                          <option value="6">6</option>
                                          <option value="7">7</option>
                                          <option value="8">8</option>
                                      </select>
                                  </div>
                              </div>
                              <div className="row">
                                  <div className="snack-item col-lg-6">
                                      <img src="images/hot-dog.png" className="extra-padding" width="150" height="100" alt="Hot Dog"/>
                                      <h5>Hot Dog</h5>
                                      <p>Price: £3</p>
                                      <label htmlFor="hot-dog-quantity">Quantity:</label>
                                      <br/>
                                      <select id="hot-dog-quantity">
                                          <option value="0">0</option>
                                          <option value="1">1</option>
                                          <option value="2">2</option>
                                          <option value="3">3</option>
                                          <option value="4">4</option>
                                          <option value="5">5</option>
                                          <option value="6">6</option>
                                          <option value="7">7</option>
                                          <option value="8">8</option>
                                      </select>
                                  </div>
                        
                                  <div className="extras-total-price-section col-lg-6">
                                      <h4>Total price: £<span id="extras-total-price">15</span></h4>
                                  </div>
                              </div>
                          </ul>
                      </div>
                  </div>
              </div> 
            </form>
          </div>);
    };
}
export default IceSkating;