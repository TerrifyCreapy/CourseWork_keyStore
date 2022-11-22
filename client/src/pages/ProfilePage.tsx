import React from 'react';
import {Store} from "../index";
import Profile from "../components/Profile";

const ProfilePage = () => {
    const store = React.useContext(Store).userStore;
    return (
        <>
            <Profile/>
        </>
    );
};

export default ProfilePage;