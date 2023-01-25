import { useState } from "react";

const getBasket = () => 
{
    const basket = localStorage.getItem("basket");
    return basket;
};
const useBasket = () => 
{
    const [basket, setBasket] = useState(getBasket());

    const saveBasket = userBasketItem =>
    {
        let basket = localStorage.getItem("basket");
        let basketData = JSON.parse(basket);
        if (basketData == undefined)
        {
            basketData = {items:[]};
        }
        basketData.items.push(userBasketItem);
        localStorage.setItem("basket", JSON.stringify(basketData));
        setBasket(userBasketItem);
    };

    return {
        setBasket: saveBasket,
        basket
    }
}
export default useBasket;