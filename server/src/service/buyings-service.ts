import { time } from "console";
import { Op } from "sequelize";
import APIError from "../errors/ApiError"
import { IGame } from "../interfaces/Igame";
import keysService from "./keys-service";
const {Buying, GamesPlatformsBuyings, Games, Platforms} = require("../models/models");
const uuid = require("uuid");
const qiwiBillPaymentsApi = require("@qiwi/bill-payments-node-js-sdk");
let secretKey = process.env.SECRET_KEY;
let publicKey = process.env.PUBLIC_KEY;
const qiwiAPI = new qiwiBillPaymentsApi(secretKey);


const checkPayment = (billId: string, link: string, email:string) => {
    const timer = setInterval(async () => {
        const response = await qiwiAPI.getBillInfo(billId);
        console.log(response.status.value);
        if(response.status.value === "EXPIRED") {
            const buying = await Buying.findOne({where: {payLink: link}});
            buying.payLink = null;
            buying.status = "Opened";
            const Keys = await keysService.deleteBookKeys(buying.dataValues.id)
            await buying.save();
            clearInterval(timer);
            return;
        }
        if(response.status.value !== "WAITING") {
            console.log("payed");
            const buying = await Buying.findOne({where: {payLink: link}});
            buying.status = "Closed";
            buying.summary = +response.amount.value;
            await buying.save();
            const newBuy = await Buying.create({userEmail: email});
            clearInterval(timer);
            return;
        }
    }, 5000);
    return timer;
};

async function findBuys(userEmail: string, platformId: number, gameId: number) {
    if(!userEmail || !platformId || !gameId) throw APIError.badRequest("Error");
    const buying = await Buying.findOne({where: {userEmail, status: "Opened"}});
    if(!buying) throw APIError.internal("Internal error");
    return buying;
}

class BuyingsService {

    async getHistory(email: string) {
        if(!email) throw APIError.badRequest("No email");
        const history = await Buying.findAndCountAll({where: {userEmail: email}});
        return history;
    }

    async getBasket(email: string) {
        if(!email) if(!email) throw APIError.badRequest("Invalid email");
        const basket = await Buying.findAll({where: {userEmail: email, status: {
            [Op.or]: ["Opened", "Paying"]
        }}});
        return basket;
    }
    async getBuyings(email: string) {
        if(!email) throw APIError.badRequest("Invalid email");
        const buyings = await Buying.findAndCountAll({where: {userEmail: email}});
        if(!buyings) throw APIError.internal("Internal error");
        return buyings;
    }
    async getBuyingGames(email: string) {


        if(!email) throw APIError.badRequest("Invalid email");
        const buyings = await Buying.findOne({where: {userEmail: email, status: {
            [Op.or]: ["Opened", "Paying"]
        }}});

        const gamesplats = await GamesPlatformsBuyings.findAll({where: {buyingId: buyings.dataValues.id}});

        const gamesPlatforms = [];

        for(let i = 0; i < gamesplats.length; i++) {
            const tGame = await Games.findOne({attributes: ["id", "name", "img", "price", "discount"], where: {id: gamesplats[i].dataValues.gameId}});
            const tPlatform = await Platforms.findOne({attributes: ["id","name"], where: {id: gamesplats[i].dataValues.platformId}});
            gamesPlatforms.push({...tGame.dataValues, count: gamesplats[i].dataValues.count, platform: tPlatform, price: Math.ceil(tGame.price - tGame.price * tGame.discount / 100)});
        }
        return gamesPlatforms;

    }
    async createNewBuing(userEmail: string) {
        if(!userEmail) throw APIError.badRequest("User's email is empty");
        const newBuy = await Buying.create({userEmail});
        return newBuy;
    }
    async addGame(userEmail: string, platformId: number, gameId: number, count: number = 1) {
        const buying = await findBuys(userEmail, platformId, gameId);
        let connection = await GamesPlatformsBuyings.findOne({where: {buyingId: buying.dataValues.id, gameId, platformId}});

        if(!connection) {
            console.log("connection not found", buying.dataValues.id, gameId, platformId);
            const newConnection = await GamesPlatformsBuyings.create({buyingId: buying.dataValues.id, gameId, platformId});
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

    async createPayment(email: string ,price: number, games: IGame[]) {
        //const date = qiwiAPI.getLifetimeByDay(0.01388888888);
        const date = qiwiAPI.getLifetimeByDay(0.00069444444);
        const id = uuid.v4();

        const prms = {
            amount: price,
            currency: "RUB",
            comment: "Test",
            expirationDateTime: date,
            successUrl: 'http://localhost:3000/profile/history',

        }
        //const link = await qiwiAPI.createPaymentForm(params);
        const link = await qiwiAPI.createBill(id, prms);
        console.log("pay");
        const buyingId = await Buying.findOne({where: {userEmail: email, status: "Opened"}});
        buyingId.payLink = link.payUrl;
        buyingId.status = "Paying";
        await buyingId.save();

        for(let i = 0; i < games.length; i++) {
            const game = await GamesPlatformsBuyings.findOne({where: {buyingId: buyingId.dataValues.id, gameId: games[i].id, platformId: games[i].platformId}});
            game.count = games[i].count;
            await game.save();
            const keys = await keysService.bookKeys(buyingId.dataValues.id, games[i].id, games[i].platformId, games[i].count);
        }

        checkPayment(id, link.payUrl, email);
        return link;
    }

}

export default new BuyingsService();