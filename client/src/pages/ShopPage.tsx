import React from 'react';
import {useSearchParams} from "react-router-dom";
import {Store} from "../index";
import {observer} from "mobx-react-lite";
import GameView from "../components/GameView";
import Filter from "../components/Filter";
import Search from "../components/Search";
import ShopFilter from "../components/ShopFilter"

interface IQuery extends URLSearchParams{
    page: number;
}

const ShopPage = () => {
    const store = React.useContext(Store).gamesStore;
    const filter = React.useContext(Store).filterStore;
    const [searchParams, setSearch] = useSearchParams();

    React.useEffect(() => {
        console.log("SettingPage");
        store.setPage(+(searchParams.get('page') || 1));
        store.fetchGames(searchParams.get("title"), searchParams.get("tagid"), searchParams.get("platformid"));
    }, [store.page, searchParams.get("title"), searchParams.get("tagid"), searchParams.get("platformid")])
    return (
        <>
            <div style={{width: "100%", flex: "1 1 auto", backgroundColor: "inherit", display: "flex", justifyContent: "center"}}>
                <Filter>
                    <ShopFilter setQuery={setSearch} query={searchParams} tags={filter.tags} tagsQuery={(searchParams.get("tagid") || "").split(".").filter(e => e !== "")}/>
                </Filter>
                <div style={{width: "596px", display: "flex", flexDirection: "column", alignItems: "center", overflow: "auto", height: "1275px", marginRight: 30}}>
                    {store.games.length?store.games.map((e: any) => <GameView key={e.id} id={e.id} img={e.img} name={e.name} price={e.price} discount={e.discount}/>): <div>No games :c</div>}
                </div>
                <Filter>
                    <Search platforms={filter.platforms} query={searchParams} setQuery={setSearch}/>
                </Filter>
            </div>
            {store.count !== 0?(Array(Math.ceil(store.count/store.limit)).fill(undefined)).map((e: any, index) => <button key={index} onClick={() => {
                store.setPage(index + 1);
                setSearch({page: String(index+1)})
            }}>{index+1}</button>):null}
        </>

    );
};

export default observer(ShopPage);