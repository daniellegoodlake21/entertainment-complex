import BookableSession from "./BookableSession.js";
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

function BookableSessionList({bookableSessions, setBookableSessions})
{

    useEffect(() =>
    {
        if (bookableSessions)
        {
            setBookableSessions(bookableSessions);
        }
    });
    if (bookableSessions === undefined)
    {
        return;
    }
    let componentContents = <div id="booking-time-slots-list">
    {
        bookableSessions.map(bookableSession => <BookableSession key={bookableSession.sessionId} session={bookableSession}/>)
    }
    </div>;
    return (componentContents);


}
BookableSessionList.propTypes = 
{
    bookableSessions: PropTypes.array,
    setBookableSessions: PropTypes.func.isRequired
};

export default BookableSessionList;