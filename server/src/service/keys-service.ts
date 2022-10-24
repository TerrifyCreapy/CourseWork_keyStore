import APIError from "../errors/ApiError";
const {Keys, Buying} = require("../models/models");

interface Ikey {
    id: number,
    value: string,
    platformId: number,
    gameId: number,
}


class KeysService {
    async addKey(value: string, platformId: number, gameId: number){
        if(!value || !platformId || !gameId) throw APIError.badRequest("Error with key!");
        const newKey = await Keys.create({value, buyId: null, platformId, gameId,});
        return newKey;
    }
    async getKey(id: number, email: string) {
        if(id === -1) throw APIError.notFound("Not found");
        if(!email) throw APIError.forbidden("Access denied");
        const userEmail = await this.isBought(id);
        if(email !== userEmail) throw APIError.forbidden("Access denied");
        const key = await Keys.findByPk(id);
        return key;
    }
    async removeKey(id: number) {
        if(id === -1) throw APIError.notFound("Not found");
        const key = Keys.destroy({
            where: {
                id
            }
        });
        return key;
    }
    async editKey(id: number, value: string, platformId: number | null, gameId: number | null) {
        if(id === -1) throw APIError.notFound("Not found");
        if(!value && !platformId && !gameId) throw APIError.badRequest("Error with key!");
        const key = await Keys.findByPk(id);

        if(!key) throw APIError.badRequest("Error with key");

        if(value.length) key.value = value;
        if(platformId !== null) key.platformId = platformId;
        if(gameId !== null) key.gameId = gameId;

        await key.save();
        console.log("saved");
    }
    private async isBought(id: number) {
        if(id === -1) throw APIError.internal("internal error");
        const key = await Keys.findByPk(id);
        if(!key) throw APIError.notFound("Not found");
        if(!key.buyingId) throw APIError.forbidden("Access denied");
        const buying = await Buying.findByPk(key.buyingId);
        if(!buying) throw APIError.internal("Internal error");
        return buying.userEmail;
    }

}

export default new KeysService();