import React from 'react';
import {observer} from "mobx-react-lite";
import {faXmark, faFloppyDisk} from "@fortawesome/free-solid-svg-icons";
import {Store} from "../../index";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import s from "./ProfileSettings.module.scss";
import ProfileModalWindow from "../Modal";
import ChangePassword from "./ChangePassword";
import Cookies from "universal-cookie";
import {bool} from "yup";
import UserApi from "../../api/UserApi";



const ProfileSettings = () => {
    const cookies = new Cookies();

    const store = React.useContext(Store).userStore;
    const {user} = React.useContext(Store).userStore;
    const [email, setEmail] = React.useState<string>(user.email);
    const [isEditEmail, setIsEmail] = React.useState<boolean>(false);
    const [isEditPassword, setPassword] = React.useState<boolean>(false);

    const time = cookies.get("ExpireTime") !== undefined && (cookies.get("ExpireTime") > new Date().getTime()/1000) ;
    console.log(time);

    const [isSended, setIsSended] = React.useState<boolean>(time);

    const sendMessage = () => {
        store.sendActivatingLink();
        cookies.set("ExpireTime", `${((new Date()).getTime()/1000)+5}`);
        setIsSended(true);
    }

    return (
        <>
            <div className={s.settings}>
                {!isEditEmail?
                    <p
                        className={s.email}
                        onClick={()=>setIsEmail(!isEditEmail)}
                    >
                        Почта: {user.email} (Нажмите, чтобы изменить.)
                    </p>
                    :
                    <input className={s.editEmail} value={email} onChange={(e) => setEmail(e.target.value)}/>}
                {isEditEmail?
                    <div>
                        <button  className={s.cancel} onClick={()=>{setEmail(user.email); setIsEmail(!isEditEmail)}}>
                            <FontAwesomeIcon icon={faXmark}/>
                        </button>
                        <button className={s.confirm} disabled={user.email === email} onClick={()=>{store.editUserData(email); setIsEmail(!isEditEmail)}}>
                            <FontAwesomeIcon icon={faFloppyDisk}/>
                        </button>
                    </div>
                    : null}
                <div className={s.confirmAccount}>Аккаунт
                    <span className={`${user.isActivated?s.confirmedAccountText:s.confirmAccountText}`}>{
                        user.isActivated?"Подтвержден":"не подтвержден"}
                    </span>
                    {!user.isActivated && <button disabled={isSended} onClick={()=>sendMessage()}>
                        Отправить подтверждение
                    </button>}
                </div>
                <div className={s.password}><p className={s.pass_text}>Пароль</p><button onClick={()=>setPassword(true)}>Изменить пароль</button></div>

            </div>
            <ProfileModalWindow active={isEditPassword} setActive={setPassword}>
                <ChangePassword/>
            </ProfileModalWindow>
        </>
    );
};

export default observer(ProfileSettings);