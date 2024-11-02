import {IUser} from "../interfaces/entities/IUser";
import {makeAutoObservable} from "mobx";
import UserApi from "../api/UserApi";
import axios from "axios";
import {IAuthResponse} from "../interfaces/entities/IAuthResponse";
import KeyApi from "../api/KeyApi";

const initialUser: IUser = {email: "", isActivated: false, roles: []};

export default class UserStore {
    _user: IUser = initialUser;
    _isAuth: boolean = false;
    _isLoading: boolean = true;
    constructor() {
        makeAutoObservable(this);
    }

    setUser(user: IUser) {
        this._user = user;
    }

    setAuth(auth: boolean) {
        console.log("set");
        this._isAuth = auth;
    }

    setLoading(load: boolean) {
        this._isLoading = load;
    }

    async login(email: string, password: string) {
        try {
            const response = await UserApi.login(email, password);
            localStorage.setItem("Token", response.data.token);

            this.setAuth(true);
            this.setUser(response.data.user);

        }
        catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async registration(email: string, password: string) {
        try {
            const response = await UserApi.registration(email, password);
            localStorage.setItem("Token", response.data.token);
            this.setAuth(true);
            this.setUser(response.data.user);
        }
        catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }
    async logout() {
        try {
            const response = await UserApi.logout();
            console.log(response);
            localStorage.removeItem("Token");
            this.setAuth(false);
            this.setUser(initialUser);
        }
        catch(e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async checkAuth() {
        this.setLoading(true);
        try {
            const response = await axios.get<IAuthResponse>(`${process.env.REACT_APP_API_URL}/user/refresh`, {withCredentials: true});
            console.log(response);
            localStorage.setItem("Token", response.data.token);
            this.setAuth(true);
            this.setUser(response.data.user);
        }
        catch(e: any) {
            console.log(e.response?.data?.message);
        }
        finally {
            this.setLoading(false);
        }
    }

    async editUserData(email: string) {
        try {
            const response = await UserApi.editUser(email, this.user.email);
            console.log(response);
            this.setUser(response.data.user);
            this.setAuth(true);
        }
        catch(e) {

        }
    }

    async editPassword(password: string, lastPass: string) {
        try {
            const response = await UserApi.editPassword(this.user.email, lastPass, password);
        }
        catch(e: any) {
            console.log(e?.response?.data?.message)
        }
    }

    async sendActivatingLink() {
        try {
            const response = await UserApi.sendMessage(this.user.email);
            console.log(response)
        }
        catch(e: any) {
            console.log(e?.response?.data?.message);
        }
    }

    get user() {
        return this._user;
    }
    get isAuth() {
        return this._isAuth;
    }
    get isLoading() {
        return this._isLoading;
    }
}