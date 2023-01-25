import PropTypes from 'prop-types';
import $ from "jquery";
import { UpdateTotalPrice } from './BookingUtils.js';

function Snack({snack})
{
    const updatePrice = (e) =>
    {

        // update price for all snacks combined
        let snacks = $("#snacks-list .row").children(".snack-item");
        let totalSnacksPrice = 0;
        for (let i = 0; i < snacks.length; i++)
        {
            let snack = snacks[i];
            let snackPrice = Number($(snack).find("p .snack-price").first().text());
            let snackQuantity = Number($(snack).find("select option:selected").val());
            totalSnacksPrice += snackPrice * snackQuantity;
        }
        totalSnacksPrice = totalSnacksPrice.toFixed(2);
        $("#booking-extras-price").text(totalSnacksPrice);
        UpdateTotalPrice();
    }
    let imagePath = "images/" + snack.snackImageRef + ".png";
    let snackId = "snack" + snack.snackId;
    return (
    <div className="snack-item col-lg-6" id={snackId}>
        <h5>{snack.snackName}</h5>      
        <img src={imagePath} height="75" alt={snack.snackName}/>
        <p>Price: £<span className="snack-price">{snack.snackPrice.toFixed(2)}</span></p>
        <label htmlFor={snackId}>Quantity:</label>
        <br/>
        <select className={snackId} onChange={(e) => updatePrice(e)}>
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