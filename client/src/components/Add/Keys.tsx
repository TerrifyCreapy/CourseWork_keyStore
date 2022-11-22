import React, {ChangeEvent} from 'react';
import {observer} from "mobx-react-lite";
import {Store} from "../../index";
import KeyApi from "../../api/KeyApi";

const Keys = () => {

    const filterStore = React.useContext(Store).filterStore;

    const [isFile, setIsFile] = React.useState<boolean>(false);

    const [key, setKey] = React.useState<string>("");
    const [file, setFile] = React.useState<File>();
    const [gameId, setGameId] = React.useState<number>(0);

    const [select, setSelect] = React.useState<number>(filterStore.platforms.length > 0?filterStore.platforms[0].id:0)

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if(e.target.files) setFile(e.target.files[0])
    }

    const onSubmit = (keyValue: string, gameId: number, platformId: number) => {
        KeyApi.createKey(keyValue, gameId, platformId).then(response => console.log(response));
    }

    return (
        <div style={{display: "flex", flexDirection: "column"}}>
            <div style={{display: "flex", justifyContent: "space-around"}}>
                {!isFile && <input type="text" value={key} onChange={(e) => setKey(e.target.value)}
                        style={{border: "1px solid black"}}/>}
                {isFile && <input type="file" onChange={handleFileChange}/>}
                <button onClick={() => setIsFile(!isFile)}>Загрузить {isFile?"ключ":"файл"}</button>
            </div>
            <input type="number" placeholder="Id игры" value={gameId} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                if(Number.isInteger(+e.target.value) && +e.target.value > 0)
                    if(e.target.value[0] === "0")
                        setGameId(+e.target.value.slice(0));
            }} style={{border: "1px solid black"}}/>
            <select name="platformId" id="platformId" onChange={(e: any) => setSelect(e.target.value) } value={select}>
                {filterStore.platforms.length > 0 && filterStore.platforms.map((e: any) => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
            <button onClick={() => onSubmit(key, gameId, select)}>Создать ключ</button>
        </div>
    );
};

export default observer(Keys);