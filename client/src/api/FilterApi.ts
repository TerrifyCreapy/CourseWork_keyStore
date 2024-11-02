import {$host, $authHost} from "./index";
import {AxiosResponse} from "axios";
import {Filter, IFilterResponse} from "../interfaces/entities/IFilterResponse";
//
export default class FilterApi {
    static async getPlatformes(): Promise<AxiosResponse<IFilterResponse>> {
        return $host.get<IFilterResponse>('/platforms');
    }

    static async getTags(): Promise<AxiosResponse<IFilterResponse>> {
        return $host.get<IFilterResponse>('/tags');
    }

    static async createPlatform(name: string): Promise<AxiosResponse<Filter>> {
        return $authHost.post<Filter>('/platforms', {
            name
        });
    }
    static async createTag(name: string): Promise<AxiosResponse<Filter>> {
        return $authHost.post<Filter>('/tags', {
            name
        });
    }

    static async removeTag(id: number): Promise<AxiosResponse<Filter>> {
        return $authHost.delete<Filter>('/tags/' + id);
    }

    static async removePlatform(id: number): Promise<AxiosResponse<Filter>> {
        return $authHost.delete<Filter>('/platforms/' + id);
    }

}