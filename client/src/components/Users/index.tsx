import React, {ChangeEvent} from 'react';
import {debounce} from "lodash";
import s from "./Users.module.scss";
import {Store} from "../../index";
import UserInfo from "../UserInfo";
import {observer} from "mobx-react-lite";

interface option {
    value: string;
    label: string;
    isDisabled?: boolean;
    isFixed?:boolean;
}

const Options: option[] = [
    {value: "USER", label: "Пользователь", isDisabled: true, isFixed: true},
    {value: "MODER", label: "Модератор", isFixed: false},
    {value: "ADMIN", label: "Администратор", isFixed: false},
]

const Users = () => {
    const usersStore = React.useContext(Store).usersStore

    const [userEmail, setUserEmail] = React.useState<string>("");
    const [emailDeb, setEmailDeb] = React.useState<string>("");

    const onChangeEmailDeb = React.useCallback(debounce((email: string) => {
        setEmailDeb(email);
    },1000),[]);

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUserEmail(event.target.value);
        onChangeEmailDeb(event.target.value);
    }

    const arr = usersStore.user? Options.filter((e: any) => {
        if(usersStore.user) {
            if(usersStore.user.roles.indexOf(e.value) > -1) {
                return e;
            }
        }
    }) : Options[0];

    React.useEffect(() => {
        if(emailDeb.length) usersStore.fetchUser(emailDeb);
        return () => {
            usersStore.setUser(null);
        }
    }, [emailDeb])

    console.log(usersStore.user, "render", arr);

    return (
        <div className={s.users}>
            <div>Введите почту пользователя</div>
            <input id={s.user__email} type="text" maxLength={144} value={userEmail} onChange={onChange}/>
            <UserInfo user={usersStore.user} arr={arr} removeUser={usersStore.removeUser.bind(usersStore)} editRoles={usersStore.editRoles.bind(usersStore)}/>
        </div>
    );
};

export default observer(Users);