import React from 'react';
import ListItem from "../ListItem";
import {Store} from "../../index";
import {observer} from "mobx-react-lite";
import {set} from "mobx";
import Modal from "../Modal";
import FilterModal from "../FilterModal";

const Tags = () => {
    const {tags} = React.useContext(Store).filterStore;
    const store = React.useContext(Store).filterStore;
    const [tagName, setTagName] = React.useState<string>("");
    const [modal, setModal] = React.useState<boolean>(false);
    return (
        <div style={{display: "flex", flex: "1 1 auto", padding: 10}}>
            <div style={{marginRight: 25, border: "1px solid black", width: "350px", maxHeight: "inherit", overflow: "auto"}}>
                {(tags).map((e, index) => <ListItem setModal={setModal} key={index} id={e.id} name={e.name} remove={store.removeTag.bind(store)}/>)}
            </div>
            <div style={{display: "flex", flexDirection: "column"}}>
                <input type="text" value={tagName} onChange={(e) => setTagName(e.target.value)} placeholder={"Наименование тега"} style={{width: 350, border: "1px solid black", padding: "5px 25px", marginBottom: "25px"}}/>
                <button onClick={()=>store.createTag(tagName)}>Подтвердить</button>
            </div>
            <Modal active={modal} setActive={setModal}>
                <FilterModal value={""} setModal={setModal}/>
            </Modal>
        </div>
    );
};

export default observer(Tags);