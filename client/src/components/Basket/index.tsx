import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRub} from "@fortawesome/free-solid-svg-icons";
import {IBasket} from "../../interfaces/entities/IBasket";
import {observer} from "mobx-react-lite";

interface IBasketComponent extends IBasket {
    onRemove: (gameId: number, platformId: number) => void;
    setCount: (id: number, count: number) => void;
}

const Basket: React.FC<IBasketComponent> = ({setCount ,id, count, name, platform, price, discount, img, onRemove}) => {

    return (
        <div style={{margin: "20px 0 0 0", width: "100%", display: "flex", justifyContent: "space-around", alignItems: "center"}}>
            <img src={img} alt="alt" style={{width: 260}}/>
            <div className="game__platform">{platform.name}</div>
            <div className="game__count"><input type="number" value={count} onInput={(e: any) => {
                if(Number.isInteger(+e.target.value) && e.target.value >= 1 && e.target.value <= 10) {
                    setCount(id, +e.target.value);
                }
            }} style={{border: "1px solid black", width: 50}}/></div>
            <div className="game__price" style={{fontSize: 23}}>{count* price}<FontAwesomeIcon icon={faRub}/></div>
            <div className="game__remove">
                <button onClick={() => onRemove(id, platform.id)}>Удалить из корзины</button>
            </div>
        </div>
    );
};

export default observer(Basket);