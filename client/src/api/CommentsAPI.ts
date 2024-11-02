import {$authHost, $host} from "./index";

export default class CommentsAPI {

    static async getComments(gameId: number) {
        return $host.get("/feedback/"+ gameId);
    }

    static async addComment(userEmail: string, gameId: number, value: string) {
        return $authHost.post("/feedback/", {
            email:userEmail,
            gameID:gameId,
            value,
        })
    }

    static async removeComment(id: number) {
        return $authHost.delete("/feedback/" + id)
    }

}