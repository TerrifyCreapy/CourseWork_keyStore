import React, {ChangeEvent, ChangeEventHandler} from 'react';
import {faCartArrowDown, faRub} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {IPlatform} from "../../interfaces/entities/IPlatform";
import {useNavigate} from "react-router";
import {auth_route} from "../../utils/constats";
import CommentItem from "../CommentItem";
import {IComment} from "../../interfaces/entities/IComment";
import GameComments from "../GameComments";
import {observer} from "mobx-react-lite";

interface IGame {
    id: number;
    name: string;
    description: string,
    img: File;
    dateRealise: string;
    price: number,
    discount: number,
    addToBasket: (email: string,count: number | null, gameId: number, platformId: number) => void,
    isAuth: boolean,
    email: string,
    platforms: IPlatform[],
    createComment: (userEmail: string, gameId: number, value: string) => void,
    deleteComment: (id: number) => void,
    comments: IComment[],
    roles: string[]
}



const Game: React.FC<IGame> = ({roles, deleteComment,comments,createComment,platforms,id, name, description, img, discount, price, addToBasket, isAuth, email}) => {
    const navigate = useNavigate();
    const [select, setSelect] = React.useState<number>(platforms[0]?.id || 0);


    const onSubmit = (id: number, email: string, input: string) => {
        createComment(email, id, input);
    }

    return (
        <>
            <div style={{position: "absolute", top: 10, left: 16}}>{name}</div>
            <img src={String(img)} alt={`image/${name}.jpeg`} style={{
                width: "620px",
                height: "380px"
            }}/>
            <button style={{
                position: "absolute",
                top: 60,
                right: 25,
                width: 150,
                height: 30,
                borderRadius: 16,
                backgroundColor: "#11f1f5",
                fontWeight: "bold",
                letterSpacing: "0.2em",
                fontSize: 14,
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                cursor: "pointer"
            }}
                    onClick={() => isAuth?addToBasket(email,1, id, select): navigate(auth_route)}
            >Купить <FontAwesomeIcon style={{color: "#9d9797"}} icon={faCartArrowDown}/></button>
            <div style={{position: "absolute", top: 40, right: "5%", fontSize: 14,color: "rgba(0,0,0,.4)"}}>Экономия {price - (Math.ceil(price - (price / 100 * discount)))} <FontAwesomeIcon icon={faRub}/></div>
            <div style={{position: "absolute", top: 75, right: "29.5%", fontSize: 20, textDecoration: "line-through", color: "rgba(0,0,0,0.4)"}}>{price} <FontAwesomeIcon icon={faRub}/></div>
            <div style={{position: "absolute", top: 75, right: "22%", fontSize: 20, color: "#ff778e", fontWeight: "bold", letterSpacing: "0.05em"}}>-{discount}%</div>
            <div style={{position: "absolute", top: 95, right: "28%", fontSize: 28, fontWeight: "bold"}}>{Math.ceil(price - (price / 100 * discount))} <FontAwesomeIcon style={{fontSize: 24}} icon={faRub}/></div>
            <div style={{
                position: "absolute",
                left: "63%",
                top: 160,
                width: 160,
                whiteSpace: "break-spaces"
            }}>{description}</div>
            <select style={{
                position: "absolute",
                top: "100px",
                right: 25,
                width: 150,
                height: 30,
                textAlign: "center",
                borderRadius: 15,
                padding: "5px 20px"
            }} name="platforms" id="platforms" onChange={(e: any) => setSelect(e.target.value) } value={select}>
                {platforms.length > 0 && platforms.map((e: any) => <option style={{textAlign: "center"}} key={e.id} value={e.id}>{e.name}</option>)}
            </select>
            <GameComments comments={comments} onSubmit={onSubmit} gameId={id} email={email} deleteComment={deleteComment} roles={roles}/>
        </>
    );
};

export default Game;