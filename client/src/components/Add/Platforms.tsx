import React from 'react';
import ListItem from "../ListItem";
import {Store} from "../../index";
import {observer} from "mobx-react-lite";
import Modal from "../Modal";
import FilterModal from "../FilterModal";

const Platforms = () => {
    const {platforms} = React.useContext(Store).filterStore;
    const store = React.useContext(Store).filterStore;
    const [platformName, setPlatformName] = React.useState<string>("");
    const [modal, setModal] = React.useState<boolean>(false);
    const [value, setValue] = React.useState<string>("");
    return (
        <div style={{display: "flex", flex: "1 1 auto", padding: 10}}>
            <div style={{marginRight: 25, border: "1px solid black", width: "350px", maxHeight: "inherit", overflow: "auto"}}>
                {(platforms).map((e, index) => <ListItem setValue={setValue} value={value} setModal={setModal} key={index} id={e.id} remove={store.removePlatform.bind(store)} name={e.name}/>)}
            </div>
            <div style={{display: "flex", flexDirection: "column"}}>
                <input type="text" value={platformName} onChange={(e) => setPlatformName(e.target.value)} placeholder={"Наименование платформы"} style={{width: 350, border: "1px solid black", padding: "5px 25px", marginBottom: "25px"}}/>
                <button onClick={()=>store.createPlatorm(platformName)}>Подтвердить</button>
            </div>
            <Modal active={modal} setActive={setModal}>
                <FilterModal setModal={setModal} value={value}/>
            </Modal>
        </div>
    );
};

export default observer(Platforms);