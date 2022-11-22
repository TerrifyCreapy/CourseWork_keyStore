import React from 'react';
import {mapRoutes} from "../../utils";
import {adminRoutes, privateRoutes, publicRoutes} from "../../routes";
import {Navigate, Route, Routes} from "react-router";
import {main_route} from "../../utils/constats";
import {Store} from "../../index";
import {observer} from "mobx-react-lite";
import {navbarStyles} from "../../styles/navStyles";

const Container = () => {
    const {isAuth, user, isLoading} = React.useContext(Store).userStore;
    const {roles} = user;
    console.log(isLoading, "Loadings");
    return (
        <div style={{display: "flex",flexDirection:"column" ,flex: "1 1 auto", background: "linear-gradient(90deg, rgba(50, 46, 47, 1) 0%, rgba(39,80,158,1) 5%, rgba(39,80,158,1) 95%, rgba(50, 46, 47,1) 100%)"}}>
            <div style={{display: "flex",flexDirection: "column", alignItems: "center" ,width: 1500, margin: "0 auto", backgroundColor: "#27509e", padding: 30, flex: "1 1 auto"}}>
                <Routes>
                    {roles.indexOf("ADMIN") > -1 && mapRoutes(adminRoutes)}
                    {isAuth && mapRoutes(privateRoutes)}
                    {mapRoutes(publicRoutes)}
                    {isLoading && !isAuth?<Route path="*" element={<p>Loading</p>}/>:<Route path="*" element={<Navigate to={"/"}/>}/>}
                </Routes>
            </div>
        </div>
    );
};

export default observer(Container);