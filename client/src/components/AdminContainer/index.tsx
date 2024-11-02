import React from 'react';
import s from "./AdminContainer.module.scss";
import AdminHeader from "../AdminHeader";
import AdminContent from "../AdminContent";

const AdminContainer = () => {
    return (
        <div className={s.container}>
            <AdminHeader/>
            <AdminContent/>
        </div>
    );
};

export default AdminContainer;