import {IUser} from "./IUser";

export interface IAuthResponse {
    token: string;
    refresh: string;
    user: IUser;
}