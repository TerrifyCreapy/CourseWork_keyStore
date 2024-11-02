import React from 'react';
import {observer} from "mobx-react-lite";
import {Store} from "../../index";
import HistoryItem from "../HistoryItem";

const History = () => {
    const historyStore = React.useContext(Store).historyStore;
    const {isAuth, user} = React.useContext(Store).userStore;
    React.useEffect(() => {
        historyStore.getHistory(user.email);
    }, [isAuth])
    console.log(historyStore.history);
    return (
        <div
            className="profile__history"
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%"
            }}
        >
            {historyStore.history.length > 0 && historyStore.history.map(e => <HistoryItem sendKeys={historyStore.sendKeys.bind(historyStore)} email={user.email} key={e.id} {...e}/>)}
        </div>
    );
};

export default observer(History);