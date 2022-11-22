import React, {ChangeEvent} from 'react';
import {IPlatform} from "../../interfaces/entities/IPlatform";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch, faXmark} from "@fortawesome/free-solid-svg-icons";

interface IShopFilter {
    query: any;
    setQuery: any;
    tags: IPlatform[];
    tagsQuery: string[];
}

const ShopFilter: React.FC<IShopFilter> = ({query, setQuery, tagsQuery, tags}) => {

    const onSearch = (event: ChangeEvent<HTMLInputElement>) => {
         if(event.target.value === "") query.delete("title");
         else query.set("title", event.target.value);
        setQuery(query);
    };
    return (
        <div className="shop__filter">
            <div
                style={{
                    position: "relative",
                    width: "100%"
                }}
                className="filter__input">
                <input type="text"
                    value={query.get("title") || ""}
                       onChange={onSearch}
                       style={{
                           border: "1px solid black",
                           width: "100%",
                           borderRadius: 20,
                           padding: "3px 50px 3px 5px"
                       }}
                />
                <FontAwesomeIcon
                    icon={faSearch}
                    style={{
                        position: "absolute",
                        top: 9,
                        right: 10,
                        fontSize: 14
                    }}
                />
                <FontAwesomeIcon
                    icon={faXmark}
                    style={{
                        position: "absolute",
                        top: 6,
                        right: 30,
                        fontSize: 20,
                        cursor: "pointer",
                        display: query.get("title") === null?"none":"block"
                    }}
                    onClick={() => {
                        query.delete("title");
                        setQuery(query);
                    }}
                />
            </div>
            <div className="filter__tags" style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                <div style={{marginTop: 20}}>Теги</div>
                {tags.length? tags.map((e: IPlatform) => {
                    return(
                        <div key={e.id} style={{
                            width: "80%",
                            padding: "5px 15px"
                        }}>
                            <input
                                type="checkbox"
                                id={"tag"+e.id}
                                name={"tag"+e.id}
                                value={e.id}
                                checked={tagsQuery.indexOf(String(e.id)) > -1}
                                onChange={(element: ChangeEvent<HTMLInputElement>) => {
                                    console.log(123)
                                    if(element.currentTarget.checked) {
                                        console.log(123123)
                                        if(tagsQuery.length === 0) {
                                            query.set("tagid", e.id);
                                            setQuery(query);
                                        }
                                        else {
                                            query.set("tagid", tagsQuery.join(".") + `.${e.id}`);
                                            setQuery(query);
                                        }
                                    }
                                    else {
                                        query.set("tagid", tagsQuery.filter((element: string) => +element !== e.id));
                                        if(query.get("tagid") === "") query.delete("tagid");
                                        setQuery(query)
                                    }
                                }}
                                style={{marginRight: 15}}
                            />
                            <label
                                htmlFor={"tag" + e.id}
                                style={{fontSize: 14, textAlign: "center", display: "inline-block", width: "20%"}}
                            >
                                {e.name}
                            </label>
                        </div>
                    );
                }):null}
                <button disabled={query.get("tagid") === null} onClick={() => {
                    query.delete("tagid");
                    setQuery(query);
                }}>Очистить</button>
            </div>
        </div>
    );
};

export default ShopFilter;