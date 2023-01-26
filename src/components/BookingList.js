import Booking from "./Booking.js";
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

function BookingList({bookings, setBookings})
{

    useEffect(() =>
    {
        if (bookings)
        {
            setBookings(bookings);
        }
    });
    if (bookings === undefined)
    {
        return;
    }
    let i = 0;
    let componentContents = <div id="basket-items-section">
    {   
        bookings.map((booking) => 
        {
            i++;
            return (<Booking key={i} booking={booking}/>);
        })
    }
    </div>;
    return (componentContents);


}
BookingList.propTypes = 
{
    bookings: PropTypes.array,
    setBookings: PropTypes.func.isRequired
};

export default BookingList;