import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./index.css";
import {BrowserRouter} from "react-router-dom";
import Stores from "./stores/Store";
import {IStore} from "./interfaces/common/IStore";
import UserStore from "./stores/UserStore";
import {FilterStore} from "./stores/FilterStore";
import {GamesStore} from "./stores/GamesStore";
import BasketStore from "./stores/BasketStore";
import HistoryStore from "./stores/HistoryStore";
import UsersStore from "./stores/UsersStore";
const store = new Stores();
const userStore = new UserStore();
const filterStore = new FilterStore();
const gamesStore = new GamesStore();
const basketStore = new BasketStore();
const historyStore = new HistoryStore();
const usersStore = new UsersStore();
export const Store = React.createContext<IStore>({rootStore: store,
    userStore: store.userStore,
    filterStore: store.filterStore,
    gamesStore: store.gamesStore,
    basketStore: store.basketStore,
    historyStore: store.historyStore,
    usersStore: store.usersStore
});


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
          <Store.Provider value={{
              rootStore: store,
              userStore: userStore,
              filterStore: filterStore,
              gamesStore: gamesStore,
              basketStore: basketStore,
              historyStore: historyStore,
              usersStore: usersStore
          }}>
              <BrowserRouter>
                <App />
              </BrowserRouter>
          </Store.Provider>
);

