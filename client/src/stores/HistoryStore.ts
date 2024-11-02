import {IHistory} from "../interfaces/entities/IHistory";
import {makeAutoObservable} from "mobx";
import BasketApi from "../api/BasketApi";
import KeyApi from "../api/KeyApi";

export default class HistoryStore {
    _history:IHistory[] = [];
    constructor() {
        makeAutoObservable(this);
    }

    setHistory(history: IHistory[]) {
        this._history = history;
    }


    async sendKeys(email: string, buyingId: number) {
        try {
            const response = await KeyApi.sendKeys(email, buyingId);
        }
        catch(e) {

        }
    }

    async getHistory(email: string) {
        try{
            const response = await BasketApi.getHistory(email);
            console.log(response, "history");
            this.setHistory(response.data.rows);
        }
        catch(e: any) {

        }
    }

    get history() {
        return this._history;
    }
}