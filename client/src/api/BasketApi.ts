import {$authHost} from "./index";
import {IPayingGame} from "../interfaces/entities/IPayingGame";

export default class BasketApi {

    static async getBasketId() {
        return $authHost.get("/buy/basket");
    }

    static async getBasket() {
        return $authHost.get("/buy/games"
        );
    }

    static async addGame(email: string, gameId: number, platformId: number, count: number | null) {
        return $authHost.post("/buy/game", {
            email,
            gameId,
            platformId,
            count,
            buyingId: 1
        })
    }

    static async createPayment(email: string, price: number, games: IPayingGame[]) {
        return $authHost.post("/buy/createPayment", {
            email,
            price,
            games
        })
    }

    static async removeGame(gameId: number, platformId: number) {
        return $authHost.delete("/buy/game/", {data:{
            gameId, platformId
        }})
    }

    static async getHistory(email: string) {
        return $authHost.get("/buy/history");
    }
}