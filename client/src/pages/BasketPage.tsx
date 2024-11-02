import React from 'react';
import Basket from "../components/Basket";
import {Store} from "../index";
import {observer} from "mobx-react-lite";
import BasketItems from "../components/BasketItems";
import EmptyBasket from "../components/EmptyBasket";

const BasketPage = () => {
    const basketStore = React.useContext(Store).basketStore;
    const {isAuth, user} = React.useContext(Store).userStore;
    React.useEffect(() => {
         if(isAuth) basketStore.getBasket();
    }, [isAuth])

    let summary: number = 0;

    if(isAuth && basketStore.basket) {
        basketStore.basket.forEach(e => summary += e.price);
    }

    return (
        <div style={{flex: "1 1 auto", backgroundColor: "white", width: 720, padding: "20px", display: "flex", flexDirection: "column", alignItems: "center"}}>
            {isAuth && basketStore.basket.length !== 0 && <BasketItems
                setCount={basketStore.setCount.bind(basketStore)}
                basket={basketStore.basket}
                isAuth={isAuth}
                email={user.email}
                basketLink={basketStore.basketLink}
                summary={summary}
                createPayment={basketStore.createPayment.bind(basketStore)}
                onRemove={basketStore.removeGame.bind(basketStore)}/>}
            {!basketStore.basket.length && <EmptyBasket/>}
        </div>
    );
};

export default observer(BasketPage);