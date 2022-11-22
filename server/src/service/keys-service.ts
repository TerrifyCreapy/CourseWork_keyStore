import APIError from "../errors/ApiError";
import { IGame } from "../interfaces/Igame";
import mailService from "./mail-service";
const sequelize = require("sequelize");
const {Keys, Buying, GamesPlatformsBuyings, Games, Platforms} = require("../models/models");

interface Ikey {
    id: number,
    value: string,
    platformId: number,
    gameId: number,
}

const removeCompared = (arr: []) =>  {
    return arr.reduce((o, i) => {
        if (!o.find((v: any) => (v.gameId == (i as {gameId: number}).gameId && v.platformId == (i as {platformId: number}).platformId))) {
          o.push(i);
        }
        return o;
      }, []);
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
    async bookKeys(buyId: number,gameId: number, platformId: number, count: number) {
        let keys = await Keys.findAndCountAll({where: {gameId, platformId}});
        if(!keys) return false;
        for(let i = 0; i < count; i++) {
            keys.rows[i].buyingId = buyId;
            await keys.rows[i].save();
        }
        
        return true;
    }

    async deleteBookKeys(buyId: number) {
        const keys = await Keys.findAndCountAll({where: {buyingId: buyId}});
        for(let i = 0; i < keys.rows.length; i++) {
            keys.rows[i].buyingId = null;
            await keys.rows[i].save();
        }
        const gamesplatsbuys = await GamesPlatformsBuyings.findAndCountAll({where: {buyingId: buyId}});
        for(let i = 0; i < gamesplatsbuys.rows.length; i++) {
            gamesplatsbuys.rows[i].count=1;
            await gamesplatsbuys.rows[i].save();
        }
        
        return true;
    }

    async checkKeys(games: IGame[] ):Promise<Boolean> {
        for(let i = 0; i < games.length; i++) {
            const keys = await Keys.findAndCountAll({where: {gameId: games[i].id, platformId: games[i].platformId, buyingId: null}});
            if(keys.count < games[i].count) return false;
        }
        return true;
    }

    async takeBoughtKeys(email: string, buyingId: number) {
        let keys = await Keys.findAll({attributes: ["gameId", "platformId"], where: {buyingId}});
        if(!keys) throw APIError.badRequest("No keys in buying!");
        keys = JSON.parse(JSON.stringify(removeCompared(keys)));

        let gamesPlatforms = [];

        for(let i = 0; i < keys.length; i++) {
            console.log(keys[i].gameId, keys[i].platformId);
            const game = await Games.findByPk(keys[i].gameId);
            console.log(game)
            const platform = await Platforms.findByPk(keys[i].platformId);
            const key = await Keys.findAll({attributes: ["value"], where: {
                buyingId,
                gameId: keys[i].gameId,
                platformId: keys[i].platformId
            }})
            keys[i] = {...keys[i], gameName: game.name, platformName: platform.name, keys: key.map((e: any) => e.value)};
        }

        let res = await mailService.sendKeys(email, keys, buyingId);

        return res;
    }

}

export default new KeysService();