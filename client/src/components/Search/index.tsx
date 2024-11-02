import React from 'react';
import {IPlatform} from "../../interfaces/entities/IPlatform";
import {set} from "mobx";

interface IShopFilter {
    query: any;
    setQuery: any;
    platforms: IPlatform[];
}

const Search:React.FC<IShopFilter> = ({query, setQuery, platforms}) => {

    const activeId = +query.get("platformid") || 0;
    console.log(activeId);

    return (
        <div style={{display: "flex", flexDirection: "column"}}>
            {platforms.length? <div>
                {platforms.map(e => <div onClick={() => {
                    query.set("platformid", e.id);
                    setQuery(query);
                }}
                    key={e.id}
                    style={{
                        fontSize: 16,
                        marginBottom: 12,
                        cursor: "pointer",
                        textDecoration: activeId === e.id? "underline": ""
                    }}
                >
                    {e.name}
                </div>)}
                <button onClick={() => {
                    query.delete("platformid");
                    setQuery(query);
                }
                } disabled={query.get("platformid") === null}>Очистить</button>
            </div>:null}
        </div>
    );
};

export default Search;