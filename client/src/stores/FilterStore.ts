import {makeAutoObservable} from "mobx";
import FilterApi from "../api/FilterApi";

interface IFilter {
    id: number;
    name: string;
}

export class FilterStore {
    _tags: IFilter[] = [];
    _platforms: IFilter[] = [];
    constructor() {
        makeAutoObservable(this);
    }

    async getPlatformes() {
        try {
            const response = await FilterApi.getPlatformes();
            this.setPlatforms(response.data.rows);
        }
        catch(e) {

        }
    }

    async createPlatorm(name: string) {
        try {
            const response = await FilterApi.createPlatform(name);
            this.setPlatforms([...this.platforms,{id: response.data.id, name: response.data.name}])
        }
        catch(e) {

        }
    }

    async getTags() {
        try {
            const response = await FilterApi.getTags();
            console.log(response, 123);
            this.setTags(response.data.rows);
        }
        catch(e) {

        }
    }

    async createTag(name: string) {
        try {
            const response = await FilterApi.createTag(name);
            this.setTags([...this.tags,{id: response.data.id, name: response.data.name}])
        }
        catch(e) {

        }
    }

    async removeTag(id: number) {
        try {
            console.log(id);
            const response = await FilterApi.removeTag(id);
            this.setTags(this.tags.filter(e => e.id!==id));
        }
        catch(e: any) {
            console.log(e.message);
        }
    }

    async removePlatform(id: number) {
        try {
            const response = await FilterApi.removePlatform(id);
            this.setPlatforms(this.platforms.filter(e => e.id!== id));
        }
        catch(e) {

        }
    }

    getNeedPlatforms(ids: number[]) {
        return this.platforms.filter(e => ids.indexOf(e.id) > -1);
    }

    setTags(tags: IFilter[]) {
        this._tags = tags;
    }
    setPlatforms(platforms: IFilter[]) {
        this._platforms = platforms;
    }
    get tags() {
        return this._tags;
    }
    get platforms() {
        return this._platforms;
    }
}