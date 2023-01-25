import PropTypes from 'prop-types';

function Booking({booking})
{
    let activity = booking.activity;
    let uppercaseFirstLetter = activity.slice(0,1).toUpperCase();
    activity = uppercaseFirstLetter + activity.replace(/([A-Z])/g, ' $1').trim().slice(1, activity.length+1);
    let keyIndex = 0;
    let date = new Date(booking.date);
    return (
    <div className="booking-data-item">
        <h3>{activity}</h3>
        
        <h4>{date.getDate()}/{date.getMonth()+1}/{date.getFullYear()} at {booking.time.slice(0, 5)}</h4>
        <p>Number of adults attending: {booking.adults}</p>
        <p>Number of children attending: {booking.children}</p>
        <h4>Booking Extras:</h4>
        <p>Snacks:</p>
        <ul>
            {
                booking.snacks.map(snack=>
                    {
                        keyIndex++;
                        return <li key={keyIndex}>{snack.snackName} X{snack.snackQuantity}</li>;
                    })
            }
        </ul>        
        <p className="no-snacks-message"></p>      
        <p className="booking-data-item-price">{booking.price}</p>

    </div>)
}
Booking.propTypes =
{
    booking: PropTypes.object.isRequired
};
export default Booking;