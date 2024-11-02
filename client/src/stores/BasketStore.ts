import {IBasket} from "../interfaces/entities/IBasket";
import {makeAutoObservable} from "mobx";
import BasketApi from "../api/BasketApi";
import {IPayingGame} from "../interfaces/entities/IPayingGame";

export default class BasketStore {
    _basket: IBasket[] = [];
    _basketId: number = -1;
    _basketStatus: string = "";
    _basketLink: string = "";
    constructor() {
        makeAutoObservable(this);
    }
    async addToBasket(email: string, count: number | null = null, gameId: number, platformId: number) {
        try {
            console.log(email, count, gameId, platformId);
            const response = await BasketApi.addGame(email, gameId, platformId, count);
            console.log(response);
        }
        catch(e) {

        }
    }

    async getBasket() {
        try {
            const response = await BasketApi.getBasket();
            const responseBasket = await BasketApi.getBasketId();

            console.log(responseBasket, 123);

            this.setBasket(response.data);
            this.setBasketInfo(responseBasket.data.id, responseBasket.data.status, responseBasket.data.payLink);
        }
        catch(e) {

        }
    }

    async createPayment(email: string, price: number, games: IPayingGame[]) {
        try {
            const response = await BasketApi.createPayment(email, price, games);
            console.log(response);
            this.setBasketPayLink(response.data);
        }
        catch(e) {

        }
    }

    async removeGame(gameId: number, platformId: number) {
        try {
            const response = await BasketApi.removeGame(gameId, platformId);
            this.setBasket(this.basket.filter((e: any) => e.id !== gameId && platformId !== e.platform.id));
        }
        catch(e) {

        }
    }

    setCount(id: number, count: number) {
        this.setBasket(this.basket.map(e => e.id !== id?e:{...e, count}))
    }

    setBasketInfo(id: number = this.basketId, status: string = this.basketStatus, paylink: string) {
        this._basketId = id;
        this._basketStatus = status;
        this._basketLink = paylink;
    }

    setBasketPayLink(link: string) {
        this._basketLink = link;
    }

    setBasket(basket: IBasket[]) {
        this._basket = basket;
    }

    get basketStatus() {
        return this._basketStatus;
    }

    get basketLink() {
        return this._basketLink;
    }

    get basketId() {
        return this._basketId;
    }

    get basket() {
        return this._basket;
    }
}