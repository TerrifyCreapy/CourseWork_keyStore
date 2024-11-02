import React from 'react';
import {IInitialGame} from "../../interfaces/entities/IInitialGame";
import {set} from "mobx";

interface IList {
    id: number;
    name: string;
    remove: (id: number) => void;
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
    setInitial?: React.Dispatch<React.SetStateAction<IInitialGame>>;
    initial?: IInitialGame;
    value?: string;
    setValue?: React.Dispatch<React.SetStateAction<string>>
}

const ListItem: React.FC<IList> = ({id ,name, remove, setModal, setInitial, initial,setValue}) => {
    return (
        <div style={{
            width: "100%",
            border: "1px solid black",
            position: "relative"
        }}>
            {id}) {name}
            <button onClick={() => {
                if(setInitial !== undefined && initial !== undefined && typeof initial !== "string") setInitial({...initial, name: name});
                if(setValue !== undefined) setValue(name);
                setModal(true);
            }} style={{position: "absolute", top: "25%", right: "30%"}}>Edit</button>
            <button onClick={() => remove(id)} style={{position: "absolute", top: "25%", right: "10%"}}>Remove</button>
        </div>
    );
};

export default ListItem;