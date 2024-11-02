import {makeAutoObservable} from "mobx";
import UserStore from "./UserStore";
import {FilterStore} from "./FilterStore";
import {GamesStore} from "./GamesStore";
import BasketStore from "./BasketStore";
import HistoryStore from "./HistoryStore";
import UsersStore from "./UsersStore";

export default class Stores {
    userStore: UserStore;
    filterStore: FilterStore;
    gamesStore: GamesStore;
    basketStore: BasketStore;
    historyStore: HistoryStore;
    usersStore: UsersStore;
    constructor() {
        this.userStore = new UserStore();
        this.filterStore = new FilterStore();
        this.gamesStore = new GamesStore();
        this.basketStore = new BasketStore();
        this.historyStore = new HistoryStore();
        this.usersStore = new UsersStore();
        makeAutoObservable(this);
    }
}