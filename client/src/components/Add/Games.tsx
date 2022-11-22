import React from 'react';
import ListItem from "../ListItem";
import {Store} from "../../index";
import Modal from "../Modal";
import AddGameModal from "../GameModal";
import {IInitialGame} from "../../interfaces/entities/IInitialGame";
import {observer} from "mobx-react-lite";

const Games = () => {
    const [modal, setModal] = React.useState<boolean>(false);
    const [initial, setInitial] = React.useState<IInitialGame>({
        id: 0,
        name: "",
        description: "",
        img: {} as File,
        price: 0,
        discount: 0,
        dateRealise: "",
        platforms: [],
        tags: []
    });
    console.log(initial);
    const store = React.useContext(Store).filterStore;
    const gamesStore = React.useContext(Store).gamesStore;

    return (
        <>
            <div style={{
                border: "1px solid black",
                width: "40%",
                flex: "1 1 auto",
                margin: "20px 0"
            }}>
                        {(gamesStore.games).map((e, index) => <ListItem initial={initial} setInitial={setInitial} key={index} id={e.id} setModal={setModal} remove={gamesStore.deleteGame.bind(gamesStore)} name={e.name}/>)}
            </div>
            <button style={{marginBottom: "15px"}} onClick={() => setModal(true)}>Add game</button>
            <Modal active={modal} setActive={setModal}>
                <AddGameModal setModal={setModal} {...initial} setInitial={setInitial}/>
            </Modal>
        </>
    );
};

export default observer(Games);