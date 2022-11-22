import React from 'react';
import s from "./Profile.module.scss";
import {Store} from "../../index";
import {observer} from "mobx-react-lite";
import { navLinks} from "../../utils";
import {profileStyles} from "../../styles/profileStyles";
import {Outlet} from "react-router";

const Profile = () => {
    const store = React.useContext(Store).userStore;
    return (
        <div className={s.profile}>
            <div className={s.menu}>{navLinks([{to: "settings", name: "Профиль"},{to: "history", name: "История"}, ], profileStyles)}
                <button onClick={()=>store.logout()} className={s.exit}>
                    Выход
                </button>
            </div>
            <div className={s.profileContent}>
                <Outlet/>
            </div>
        </div>
    );
};

export default observer(Profile);