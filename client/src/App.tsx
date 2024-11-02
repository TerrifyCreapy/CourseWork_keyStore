import React from 'react';
import Header from "./components/Header";
import Index from "./components/Footer";
import Container from "./components/Container";
import {observer} from "mobx-react-lite";
import {Store} from "./index";

function App() {
    const store = React.useContext(Store).userStore;
    const filterStore = React.useContext(Store).filterStore;
    React.useEffect(()=>{
        if(localStorage.getItem("Token")) {
            store.checkAuth();
        }
        filterStore.getPlatformes();
        filterStore.getTags();

    },[]);

  return (
    <>
        <Header/>
        <Container/>
        <Index/>
    </>
  );
}

export default observer(App);
