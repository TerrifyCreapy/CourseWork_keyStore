import {$authHost, $host} from "./index";

export class GamesApi {

    static getGames(page: number = 1, limit: number = 5, title: string | null = "", tagid: string | null, platformid: string | null) {
        const queryParams = {
            page: `?page=${page}`,
            limit: `&limit=${limit}`,
            title: title === "" || title === null?"":`&title=${title}`,
            tagid: tagid === null?"":`&tagid=${tagid}`,
            platformid: platformid === null?"":`&platformid=${platformid}`,

        }
        return $host.get('/games' + queryParams.page + queryParams.limit + queryParams.title + queryParams.tagid + queryParams.platformid);
    }

    static createGame(data: FormData) {
        return $authHost.post('/games/', data)
    }

    static deleteGame(id: number) {
        return $authHost.delete('/games/' + id);
    }

    static getGame(id: number) {
        return $host.get('/games/' + id);
    }
}

