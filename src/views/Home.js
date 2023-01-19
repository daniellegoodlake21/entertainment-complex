import React, {Component} from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Carousel, CarouselItem } from "react-bootstrap";
import "./styles.css";
class Home extends Component
{
  render()
  {
    return (
    <div>
        <h1 className="title text-light central-header">Activities</h1>
        <Carousel id="activities-carousel">
            <CarouselItem>
                <img className="d-block w-100" src="images/ice-skating.jpg"  alt="Ice Skating"/>
                <div className="carousel-caption">
                    <Link to="/ice-skating" className="h3 text-light activity-link">Go Ice Skating</Link>
                </div>
            </CarouselItem>
            <CarouselItem>
                <img className="d-block w-100" src="images/theatre.jpg"  alt="Theatre"/>
                <div className="carousel-caption">
                    <Link to="/theatre" className="h3 text-light activity-link">Enjoy the Theatre</Link>
                </div>
            </CarouselItem>
            <CarouselItem>
                <img className="d-block w-100" src="images/cinema.jpg" alt="Cinema"/>
                <div className="carousel-caption">
                    <Link to="/cinema" className="h3 text-light activity-link">Visit the Cinema</Link>
                </div>
            </CarouselItem>
            <CarouselItem>
                <img className="d-block w-100" src="images/bowling.jpg" alt="Bowling"/>
                <div className="carousel-caption">
                    <Link to="/theatre" className="h3 text-light activity-link">Go Bowling</Link>
                </div>
            </CarouselItem>
        </Carousel>
    </div>
    );
    
  }
}
export default Home;