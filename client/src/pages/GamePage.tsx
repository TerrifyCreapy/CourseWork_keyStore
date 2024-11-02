import React from 'react';
import {Navigate, useParams} from "react-router";
import {Store} from "../index";
import Game from "../components/Game";
import {observer} from "mobx-react-lite";
import {IPlatform} from "../interfaces/entities/IPlatform";

const GamePage = () => {
    const {id} = useParams();
    const idParsed: number = +(id as string);
    const gamesStore = React.useContext(Store).gamesStore;
    const basketStore = React.useContext(Store).basketStore;
    const filterStore = React.useContext(Store).filterStore;
    const {isAuth,user} = React.useContext(Store).userStore;
    React.useEffect(() => {
        gamesStore.getGame(idParsed);
        gamesStore.fetchComments(idParsed)
    }, [idParsed]);

    console.log(gamesStore.isLoading, "Loading games")

    console.log(gamesStore.platformsId[0]?.platformIds, "platformsId");

    const platforms = filterStore.getNeedPlatforms(gamesStore.platformsId[0]?.platformIds?.map((e:any) => {
        return e;
    }) || []);

    console.log(platforms, "platforms");

    if(isNaN(idParsed)) {
        return <Navigate to={"/"}/>
    }
    else {
        return (
            <div style={{
                width: "1024px",
                flex: "1 1 auto",
                backgroundColor: "white",
                position: "relative",
                padding: "50px 0px"
            }}>
                {!gamesStore.isLoading && gamesStore.games.length && gamesStore.platformsId.length && <Game
                    {...gamesStore.games[0]} comments={gamesStore.comments} roles={user.roles} deleteComment={gamesStore.removeComment.bind(gamesStore)} createComment={gamesStore.createComment.bind(gamesStore)} addToBasket={basketStore.addToBasket.bind(basketStore)} isAuth={isAuth} email={user.email} platforms={platforms}/>}
            </div>
        )
    }
};

export default observer(GamePage);