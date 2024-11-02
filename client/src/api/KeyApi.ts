import {$authHost} from "./index";

export default class KeyApi {
    static async createKey(keyValue: string, gameId:number, platformId:number) {
        return $authHost.post("/keys/", {
            keyValue, gameId, platformId
        })
    }

    static async sendKeys(email: string, buyingId: number) {
        return $authHost.post("/keys/send", {
            userEmail: email,
            buyingId
        })
    }
}