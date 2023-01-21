import { Component } from 'react';
import PropTypes from 'prop-types';

function BookableSession({session})
{
    return (
    
        <div id={session.session_id} className="text-light booking-time-slot-item">
            <h6 className="time-slot">{session.timeSlot}</h6>
            <p>Remaining Available Slots: <span className="slots-available">{session.slotsRemaining}</span></p>
            <p>Price Per Person:<br/>Adult: £<span className="adult-price">{session.adultPrice}</span><br/>Child: £<span className="child-price">{session.childPrice}</span></p>
        </div>
    );
}
BookableSession.propTypes =
{
    session: PropTypes.object.isRequired,
};
export default BookableSession;