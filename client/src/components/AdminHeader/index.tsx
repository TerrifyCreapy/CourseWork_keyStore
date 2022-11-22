import React from 'react';
import s from "./AdminHeader.module.scss";
import {adminLinks} from "../../utils/constats";
import {navLinks} from "../../utils";
import {adminStyles} from "../../styles/adminStyles";
const AdminHeader = () => {
    return (
        <div className={s.Header}>
            {navLinks([{to: "platforms", name: "Платформы"}, {to: "tags", name: "Теги"}, {to: "games", name: "Игры"}, {to: "keys", name: "Ключи"}, {to: "users", name: "Пользователи"}], adminStyles)}
        </div>
    );
};

export default AdminHeader;