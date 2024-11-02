import React from 'react';

import {faRuble} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {NavLink} from "react-router-dom";
import {game_route} from "../../utils/constats";

interface IGameView {
    id: number;
    img: string;
    name: string;
    price: number;
    discount: number;
}

const GameView: React.FC<IGameView> = ({id, img, name, price, discount}) => {
    return (
        <NavLink to={"/"+id} style={{width: "558px", display: "flex", height: "107px", backgroundColor: "white", marginBottom: 20, position: "relative", color: "black"}}>
            <img style={{width: 150}} src={img} alt=""/>
            <div className="game_name" style={{position: "absolute", top: "15px", left: "30%", height: "50px", maxWidth: "268px", whiteSpace: "break-spaces"}}>{name}</div>
            <div className="price_block" style={{position: "absolute", display: "flex", right: 3, bottom: 5}}>
                <div className="game_price" style={{fontSize: 18, backgroundColor: "rgba(0,0,0, 0.1)", padding: "6px 4px 6px 4px", display: "flex", justifyContent: "center", alignItems: "center"}} >-{price-Math.floor(price - (price / 100 * discount))} <FontAwesomeIcon icon={faRuble}/></div>
                <div className="game_new_price" style={{fontSize: 18, marginLeft: 16, display: "flex", justifyContent: "center", alignItems: "center"}}>{Math.floor(price - (price / 100 * discount))} <FontAwesomeIcon icon={faRuble}/></div>
            </div>

            <div className="game_discount" style={{position: "absolute", top: "33%", right: "0", backgroundColor: "#b42c2c", width: 70, height: 35, display: "flex", justifyContent: "center", alignItems: "center", color: "white"}}>-{discount}%</div>
        </NavLink>
    );
};

export default GameView;