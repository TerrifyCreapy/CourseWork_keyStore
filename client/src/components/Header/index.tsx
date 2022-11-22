import React from 'react';
import s from "./Header.module.scss";
import {navLinks} from "../../utils";
import {NavLink} from "react-router-dom";
import {adminLinks, auth, NavlinksPublic, profile} from "../../utils/constats";
import {observer} from "mobx-react-lite";
import {Store} from "../../index";
import HeaderSkeleton from "../Loader";
import {navbarStyles} from "../../styles/navStyles";

const Header = () => {
    const {isAuth, user, isLoading} = React.useContext(Store).userStore;
    const {roles} = user;
    return (
        <div className={s.header}>
            <div className={s.content}>
                <NavLink to={"/"}>LOGO</NavLink>
                <div className={s.routes}>
                { <div className={s.routes}>
                    {(roles).indexOf("ADMIN") > -1 && navLinks(adminLinks, navbarStyles)}
                    {navLinks(NavlinksPublic, navbarStyles)}
                    {isAuth?navLinks(profile, navbarStyles):navLinks(auth, navbarStyles)}
                </div>}
                </div>
            </div>
        </div>
    );
};

export default observer(Header);