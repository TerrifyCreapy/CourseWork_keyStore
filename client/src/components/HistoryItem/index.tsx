import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRub} from "@fortawesome/free-solid-svg-icons";
import {NavLink} from "react-router-dom";
import {basket_route} from "../../utils/constats";

interface IHistoryItem {
    id: number;
    updatedAt: string;
    status: string;
    payLink: string;
    summary: number;
    createdAt: string;
    sendKeys: (email: string, buyingId: number) => void;
    email: string;
}

function toNormalView(date: string, status: string, created: string) {
    const returnObj = {
        date: "",
        status: "",
        created: "",
        color: ""
    }

    switch (status) {
        case "Opened": {
            returnObj.status = "Открыт";
            returnObj.color = "#7a0404";
            break;
        }
        case "Closed": {
            returnObj.status = "Оплачено";
            returnObj.color = "#166905";
            break;
        }
        default: {
            returnObj.status = "Оплачивается";
            returnObj.color = "#FFBA00";
        }
    }

    let newDate: Date | string = new Date(date.slice(0,-5));

    returnObj.date = `${newDate.getDate()}.${newDate.getMonth()+1}.${newDate.getFullYear()} | ${newDate.getHours()}:${newDate.getMinutes()}`;
    newDate = new Date(created.slice(0, -5));
    returnObj.created = `${newDate.getDate()}.${newDate.getMonth()+1}.${newDate.getFullYear()} | ${newDate.getHours()}:${newDate.getMinutes()}`;
    return returnObj;
}

const HistoryItem:React.FC<IHistoryItem> = ({id, updatedAt, status, payLink, summary, createdAt, sendKeys, email}) => {

    const data = toNormalView(updatedAt, status, createdAt);

    return (
        <div className="history__ item" style={{
            border: " 1px solid black",
            padding: "10px",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 15
        }}>
            <div
                className={"history__date"}
                style={{
                    fontSize: 16
                }}
            >
                {data.created}
            </div>
            <div
                className={"history_status"}
                style={{
                    fontSize: 16,
                    color: data.color
                }}
            >
                {data.status}
            </div>
            <div
                className={"history__summary"}
                style={{
                    fontSize: 18,
                    fontWeight: "normal"
                }}
            >
                {summary}<FontAwesomeIcon icon={faRub}/>
            </div>
            <div
                className={"history__buttons"}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: 160
            }}
            >
                {status === "Opened" || status === "Paying"? <NavLink
                    to={basket_route}
                    style={{
                        color: "#000",
                        fontSize: 16,
                        border: "1px solid black",
                        padding: "0px 10px",
                        borderRadius: 20
                }}>Корзина</NavLink>:null}
                {status === "Closed" || status === "Paying"? <a href={payLink} target={"_blank"} style={{fontSize: 16, color: "#000", border: "1px solid black", padding: "0 10px", borderRadius: 20, margin: "10px 0"}}>Страница оплаты</a>:null}
                {status === "Closed"? <button onClick={() => sendKeys(email, id)} style={{
                    width: "100%",
                    backgroundColor: "inherit",
                    border: "1px solid black",
                    borderRadius: 20,
                    marginTop: 10,
                    cursor: "pointer"
                }}>Отправить покупки</button>: null}
            </div>
        </div>
    );
};

export default HistoryItem;