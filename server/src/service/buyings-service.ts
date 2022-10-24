import APIError from "../errors/ApiError";
const {Buying, GamesPlatformsBuyings} = require("../models/models");

async function findBuys(userEmail: string, platformId: number, gameId: number) {
    if(!userEmail || !platformId || !gameId) throw APIError.badRequest("Error");
    const buying = await Buying.findAll({where: {userEmail, status: "Opened"}});
    if(!buying) throw APIError.internal("Internal error");
    return buying;
}

class BuyingsService {
    async getBuyings(email: string) {
        if(!email) throw APIError.badRequest("Invalid email");
        const buyings = await Buying.findAndCountAll({where: {userEmail: email}});
        if(!buyings) throw APIError.internal("Internal error");
        return buyings;
    }
    async setStatusPaying(id: number, status: string) {
        if(!id) throw APIError.badRequest("Error with id of buying");
        if(!status) throw APIError.badRequest("Error with status");
        const buying = await Buying.findByPk(id);
        if(!buying) throw APIError.notFound("Not found buying");
        buying.status = status;
        await buying.save();
    }
    async createNewBuing(userEmail: string) {
        if(!userEmail) throw APIError.badRequest("User's email is empty");
        const newBuy = await Buying.create({userEmail});
        return newBuy;
    }
    async addGame(userEmail: string, platformId: number, gameId: number, count: number = 1) {
        const buying = await findBuys(userEmail, platformId, gameId);
        let connection = await GamesPlatformsBuyings.findAll({where: {buyingId: buying.id, gameId, platformId}});
        if(!connection) {
            const newConnection = await GamesPlatformsBuyings.create({buyingId: buying.id, gameId, platformId});
            return newConnection;
        }
        else {
            connection.count = count;
            await connection.save();
            return connection;
        }
    }
    async removeGame(userEmail: string, platformId: number, gameId: number) {
        const buying = await findBuys(userEmail, platformId, gameId);
        const gameRemove = await GamesPlatformsBuyings.destroy({where: {buyingId: buying.id, platformId, gameId}});
        return gameRemove;
    }
}

export default new BuyingsService();