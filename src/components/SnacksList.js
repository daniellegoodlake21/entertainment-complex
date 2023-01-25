import PropTypes from 'prop-types';
import Snack from './Snack.js';
import { useEffect } from 'react';

function SnacksList({snacks, setSnacks})
{
    useEffect(() =>
    {
        if (snacks)
        {
            setSnacks(snacks);
        }
    });
    if (snacks === undefined)
    {
        return;
    }
    return (<div id="snacks-list" className="container-fluid">
                <div className="row">
                    {
                        snacks.map(currentSnack => <Snack key={currentSnack.snackId} snack={currentSnack}/>)
                    }
                </div>
            </div>);
}
SnacksList.propTypes = 
{
    snacks: PropTypes.array,
    setSnacks: PropTypes.func.isRequired
};

export default SnacksList;