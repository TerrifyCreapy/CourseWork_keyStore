import {makeAutoObservable} from "mobx";
import {GamesApi} from "../api/GamesApi";
import {IInitialGame} from "../interfaces/entities/IInitialGame";
import {IFilter} from "../interfaces/entities/IFilter";
import Game from "../components/Game";
import {IComment} from "../interfaces/entities/IComment";
import CommentsAPI from "../api/CommentsAPI";
import {ErrorInfo} from "react";

export class GamesStore {
    _page: number = 1;
    _limit: number = 10;
    _games: IInitialGame[] = [];
    _count: number = 0;
    _platformsIds: IFilter[] = [];
    _isLoading: boolean = true;
    _comments: IComment[] = [];
    constructor() {
        makeAutoObservable(this);
    }

    async fetchGames(title: string | null = "", tagid: string | null = "", platformid: string | null = "") {
        try {
            const response = await GamesApi.getGames(this.page, this.limit, title, tagid, platformid);
            console.log(response);
            this.setGames(response.data.games.rows);
            this.setCount(response.data.games.count);
            this.setPlatformsGames(response.data.platforms);
        }
        catch(e) {

        }
    }

    async fetchComments(id: number) {
        try {
            const response = await CommentsAPI.getComments(id);
            this.setComments(response.data.rows);
        }
        catch(e) {

        }
    }

    async createComment(userEmail: string, gameId: number, value: string){
        try {
            const response = await CommentsAPI.addComment(userEmail, gameId, value);
            if(response.status === 201) {
                this.setComments([...this.comments, response.data]);
            }
        }
        catch(e) {

        }
    }

    async removeComment(id: number) {
        try {
            const response = await CommentsAPI.removeComment(id);
            if(response.status === 200) {
                this.setComments(this.comments.filter(e => e.id !== id));
            }
            else {
                throw new Error("Ошибка на сервере")
            }
        }
        catch(e: any) {
            console.debug(e.message);
        }
    }

    async createGame(data: FormData) {
        try {
            const response = await GamesApi.createGame(data);
            console.log(response);
            this.setGames([...this.games, response.data]);
        }
        catch(e) {

        }
    }

    async deleteGame(id: number) {
        try {
            const response = await GamesApi.deleteGame(id);
            console.log(response);
            this.setGames(this.games.filter(e => e.id !== id));
        }
        catch(e: any) {
            console.log(e.message);
        }
    }

    async getGame(id: number) {
        this.setIsLoading(true);
        try {
            const response = await GamesApi.getGame(id);
            console.log(response, "response");
            this.setGames([response.data.game]);
            this.setPlatformsGames([{gameId: response.data.game.id, platformIds: response.data.platforms}]);
            this.setIsLoading(false);
        }
        catch(e) {

        }
    }

    setIsLoading(bool: boolean) {
        this._isLoading = bool;
    }

    setPlatformsGames(platforms: IFilter[]) {
        this._platformsIds = platforms;
    }

    setGames(games: IInitialGame[]) {
        this._games = games;
    }

    setCount(count: number) {
        this._count = count;
    }

    setPage(page: number) {
            this._page = page;
    }

    setComments(comms: IComment[]) {
        this._comments = comms;
    }

    get comments() {
        return this._comments;
    }

    get isLoading() {
        return this._isLoading;
    }

    get page() {
        return this._page;
    }
    get limit() {
        return this._limit;
    }
    get games() {
        return this._games;
    }
    get count() {
        return this._count;
    }
    get platformsId() {
        return this._platformsIds;
    }
}