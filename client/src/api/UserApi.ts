import {$host, $authHost} from "./index";
import {AxiosResponse} from "axios";
import {IAuthResponse} from "../interfaces/entities/IAuthResponse";
//
export default class UserApi {
    static async login(email: string, password: string): Promise<AxiosResponse<IAuthResponse>> {
        return $host.post<IAuthResponse>('/user/login', {email, password});
    }
    static async registration(email: string, password: string): Promise<AxiosResponse<IAuthResponse>> {
        return $host.post<IAuthResponse>('/user/registration', {email, password});
    }
    static async logout(): Promise<void> {
        return $authHost.post('/user/logout');
    }
    static async editUser(email: string, lastEmail: string): Promise<AxiosResponse<IAuthResponse>> {
        return $authHost.post('/user/edit/' + lastEmail, {
            email,
            lastEmail
        })
    }
    static async editPassword(email: string ,lastPassword: string, password: string): Promise<AxiosResponse<IAuthResponse>> {
        return $authHost.post('/user/edit/pass/' + email, {
            last: lastPassword,
            New: password
        })
    }
    static async sendMessage(email: string) :Promise<AxiosResponse<IAuthResponse>>{
        return $authHost.post('/user/send', {
            email
        })
    }

    static async getUser(email: string) {
        return $authHost.get("/user/getuser/" + email);
    }

    static async removeUser(email: string) {
        return $authHost.delete("/user/remove/" + email);
    }

    static async editRoles(roles: string[], email: string) {
        return $authHost.post("/user/roles/" + email, {
            roles
        })
    }
}