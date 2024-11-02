import React from 'react';
import s from "../Users/Users.module.scss";
import Select, {components} from "react-select";
import {observer} from "mobx-react-lite";

interface option {
    value: string;
    label: string;
    isDisabled?: boolean;
    isFixed?:boolean;
}
interface IUser {
    user: {
        email: string;
        isConfirmed: boolean;
        roles: string[];
        createdAt: string;
    } | null,
    arr:  option[] | option;
    removeUser: (email: string) => void;
    editRoles: (arr: string[], email: string) => void;
}



const toString = (arr: string[]): string => {

    for(let i  = 0; i < arr.length; i++) {
        switch(arr[i]) {
            case "USER": {
                arr[i] = "пользователь";
                break;
            }
            case "MODER": {
                arr[i] = "модератор";
                break;
            }
            case "ADMIN": {
                arr[i] = "администратор";
                break;
            }
        }
    }

    return arr.join(", ");
}

const Options: option[] = [
    {value: "USER", label: "Пользователь", isDisabled: true, isFixed: true},
    {value: "MODER", label: "Модератор", isFixed: false},
    {value: "ADMIN", label: "Администратор", isFixed: false},
]

const Option = (props: any) => {
    console.log(props.children, "props");
    return (
        <div>
            <components.Option isDisabled={props.children === "Пользователь"} {...props}>
                <input
                    disabled={props.children === "Пользователь"}
                    type="checkbox"
                    checked={props.isSelected}
                    onChange={() => null}
                />{" "}
                <label>{props.label}</label>
            </components.Option>
        </div>
    );
};


const orderOptions = (values: any) => {
    return (
        values &&
        values.filter((v: any) => v.isFixed).concat(values.filter((v: any) => !v.isFixed))
    );
};


const UserInfo: React.FC<IUser> = ({user, arr, removeUser, editRoles}) => {
    console.log("render info", arr);


    const [select, setSelect] = React.useState<any>(arr);

    React.useEffect(() => {
        console.log("render")
        setSelect(arr);

    }, [arr])
    console.log(select, arr, "selectarr")
    // @ts-ignore
    const onChangeCheckBox = (value: any, { action , removedValue }) => {
        switch (action) {
            case "remove-value":
            case "pop-value":
                if (removedValue.isFixed) {
                    return;
                }
                break;
            case "clear":
                value = Options.filter(v => v.isFixed);
                break;
            default:
                break;
        }
        value = orderOptions(value);
        setSelect(value);
    };

    return (
        <div className={s.user__info}>
            <div>Информация о пользователе {user?`${user.email}`:"никто"}</div>
            <div>Аккаунт <span className={`${user && user.isConfirmed? s.confirmed: s.nconfirmed}`}>{user && user.isConfirmed?"подтвержден":"не подтвержден"}</span></div>
            <div>Аккаунт зарегистрирован {user?`${user.createdAt}`:"никогда"}</div>
            <div>{user?`Имеет роли: ${user.roles}`: `Не имеет ролей`}</div>

            {user?
                <>
                    <Select
                        className={s.user__roles}
                        options={Options}
                        isMulti
                        isClearable={!Array.isArray(select) ? select.value === "Пользователь" : select.some((v: option) => !v.isFixed)}
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        components={{
                            Option
                        }}
                        // @ts-ignore
                        onChange={onChangeCheckBox}
                        value={select}
                    />
                    <div className={s.buttons}>
                        <button
                            id={s.delete}
                            onClick={() => {
                                removeUser(user.email)
                            }}
                        >
                            Удалить пользователя
                        </button>
                        <button
                            id={s.submit}
                            disabled={Array.isArray(arr)?arr.length === select.length:arr.value===select.value}
                            onClick={() => editRoles(Array.isArray(select)?select.map(e => e.value):[select.value], user.email)}
                        >
                            Подтвердить
                        </button>
                    </div>
                </>:null}
        </div>
    );
};

export default observer(UserInfo);