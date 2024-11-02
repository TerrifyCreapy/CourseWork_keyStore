import UserStore from "../../stores/UserStore";
import Stores from "../../stores/Store";
import {FilterStore} from "../../stores/FilterStore";
import {GamesStore} from "../../stores/GamesStore";
import BasketStore from "../../stores/BasketStore";
import HistoryStore from "../../stores/HistoryStore";
import UsersStore from "../../stores/UsersStore";

export interface IStore {
    rootStore: Stores;
    userStore: UserStore;
    filterStore: FilterStore;
    gamesStore: GamesStore;
    basketStore: BasketStore;
    historyStore: HistoryStore;
    usersStore: UsersStore;
}