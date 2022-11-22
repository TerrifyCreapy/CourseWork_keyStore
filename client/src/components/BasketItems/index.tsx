import React from 'react';
import Basket from "../Basket";
import {IBasket} from "../../interfaces/entities/IBasket";
import {IPayingGame} from "../../interfaces/entities/IPayingGame";
import {observer} from "mobx-react-lite";

interface IBasketItems {
    isAuth: boolean;
    basket: IBasket[];
    email: string;
    summary: number;
    basketLink: string | null;
    createPayment: (email: string, summary: number, games: IPayingGame[]) => void;
    onRemove: (gameId: number, platformId: number) => void;
    setCount: (id: number, count: number) => void;
}

const BasketItems: React.FC<IBasketItems> = ({isAuth, basket, email, summary, basketLink,createPayment, onRemove, setCount}) => {
    return (
        <>
            {isAuth && basket && basket.map((e: any) => <Basket key={e.id} {...e} onRemove={onRemove} setCount={setCount}/>)}
            {summary}
            {basketLink === null? <button onClick={() => createPayment(email, summary, basket.map((e): IPayingGame => {
                return {id: e.id, count: e.count, platformId: e.platform.id}
            }))}>Оплатить</button>: <a target="_blank" href={basketLink}>Форма оплаты</a>}
        </>
    );
};

export default observer(BasketItems);