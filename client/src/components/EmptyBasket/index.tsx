import React from 'react';
import {NavLink} from "react-router-dom";
import {main_route} from "../../utils/constats";

const EmptyBasket = () => {
    return (
        <div>
            Basket is now empty :(
            <NavLink to={main_route}>Go to shop</NavLink>
        </div>
    );
};

export default EmptyBasket;