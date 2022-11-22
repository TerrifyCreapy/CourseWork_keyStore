import {makeAutoObservable} from "mobx";
import UserApi from "../api/UserApi";

interface IUser {
    email: string;
    isConfirmed: boolean;
    roles: string[];
    createdAt: string;
}

export default class UsersStore {
    _user:IUser | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    async fetchUser(email: string) {
        try {
            const response = await UserApi.getUser(email);
            if(response.status === 200) {
                this.setUser(response.data);
            }
            console.log(response)
        }
        catch(e) {

        }
    }

    async removeUser(email: string) {
        try {
            const response = await UserApi.removeUser(email);
            if(response.status === 200) {
                this.setUser(null);
            }
        }
        catch(e) {

        }
    }

    async editRoles(arr: string[], email: string) {
        try {
            const response = await UserApi.editRoles(arr, email);
        }
        catch(e) {

        }
    }

    setUser(user: IUser | null) {
        this._user = user;
    }

    get user() {
        return this._user;
    }


}