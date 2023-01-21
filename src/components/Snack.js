import PropTypes from 'prop-types';


function Snack({snack})
{
    let imagePath = "images/" + snack.snackImageRef + ".png";
    let snackId = snack.snackId;
    return (<div className="snack-item col-lg-6">
    <h5>{snack.snackName}</h5>      
    <img src={imagePath} height="75" alt={snack.snackName}/>
    <p>Price: £1.50</p>
    <label htmlFor={{snackId}}>Quantity:</label>
    <br/>
    <select className={{snackId}}>
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
</div>);
}
Snack.propTypes = 
{
    snack: PropTypes.object.isRequired
};

export default Snack;