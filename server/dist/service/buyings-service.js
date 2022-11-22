"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const keys_service_1 = __importDefault(require("./keys-service"));
const { Buying, GamesPlatformsBuyings, Games, Platforms } = require("../models/models");
const uuid = require("uuid");
const qiwiBillPaymentsApi = require("@qiwi/bill-payments-node-js-sdk");
let secretKey = process.env.SECRET_KEY;
let publicKey = process.env.PUBLIC_KEY;
const qiwiAPI = new qiwiBillPaymentsApi(secretKey);
const checkPayment = (billId, link, email) => {
    const timer = setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield qiwiAPI.getBillInfo(billId);
        console.log(response.status.value);
        if (response.status.value === "EXPIRED") {
            const buying = yield Buying.findOne({ where: { payLink: link } });
            buying.payLink = null;
            buying.status = "Opened";
            const Keys = yield keys_service_1.default.deleteBookKeys(buying.dataValues.id);
            yield buying.save();
            clearInterval(timer);
            return;
        }
        if (response.status.value !== "WAITING") {
            console.log("payed");
            const buying = yield Buying.findOne({ where: { payLink: link } });
            buying.status = "Closed";
            buying.summary = +response.amount.value;
            yield buying.save();
            const newBuy = yield Buying.create({ userEmail: email });
            clearInterval(timer);
            return;
        }
    }), 5000);
    return timer;
};
function findBuys(userEmail, platformId, gameId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!userEmail || !platformId || !gameId)
            throw ApiError_1.default.badRequest("Error");
        const buying = yield Buying.findOne({ where: { userEmail, status: "Opened" } });
        if (!buying)
            throw ApiError_1.default.internal("Internal error");
        return buying;
    });
}
class BuyingsService {
    getHistory(email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email)
                throw ApiError_1.default.badRequest("No email");
            const history = yield Buying.findAndCountAll({ where: { userEmail: email } });
            return history;
        });
    }
    getBasket(email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email)
                if (!email)
                    throw ApiError_1.default.badRequest("Invalid email");
            const basket = yield Buying.findAll({ where: { userEmail: email, status: {
                        [sequelize_1.Op.or]: ["Opened", "Paying"]
                    } } });
            return basket;
        });
    }
    getBuyings(email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email)
                throw ApiError_1.default.badRequest("Invalid email");
            const buyings = yield Buying.findAndCountAll({ where: { userEmail: email } });
            if (!buyings)
                throw ApiError_1.default.internal("Internal error");
            return buyings;
        });
    }
    getBuyingGames(email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email)
                throw ApiError_1.default.badRequest("Invalid email");
            const buyings = yield Buying.findOne({ where: { userEmail: email, status: {
                        [sequelize_1.Op.or]: ["Opened", "Paying"]
                    } } });
            const gamesplats = yield GamesPlatformsBuyings.findAll({ where: { buyingId: buyings.dataValues.id } });
            const gamesPlatforms = [];
            for (let i = 0; i < gamesplats.length; i++) {
                const tGame = yield Games.findOne({ attributes: ["id", "name", "img", "price", "discount"], where: { id: gamesplats[i].dataValues.gameId } });
                const tPlatform = yield Platforms.findOne({ attributes: ["id", "name"], where: { id: gamesplats[i].dataValues.platformId } });
                gamesPlatforms.push(Object.assign(Object.assign({}, tGame.dataValues), { count: gamesplats[i].dataValues.count, platform: tPlatform, price: Math.ceil(tGame.price - tGame.price * tGame.discount / 100) }));
            }
            return gamesPlatforms;
        });
    }
    createNewBuing(userEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userEmail)
                throw ApiError_1.default.badRequest("User's email is empty");
            const newBuy = yield Buying.create({ userEmail });
            return newBuy;
        });
    }
    addGame(userEmail, platformId, gameId, count = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            const buying = yield findBuys(userEmail, platformId, gameId);
            let connection = yield GamesPlatformsBuyings.findOne({ where: { buyingId: buying.dataValues.id, gameId, platformId } });
            if (!connection) {
                console.log("connection not found", buying.dataValues.id, gameId, platformId);
                const newConnection = yield GamesPlatformsBuyings.create({ buyingId: buying.dataValues.id, gameId, platformId });
                return newConnection;
            }
            else {
                connection.count = count;
                yield connection.save();
                return connection;
            }
        });
    }
    removeGame(userEmail, platformId, gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            const buying = yield findBuys(userEmail, platformId, gameId);
            const gameRemove = yield GamesPlatformsBuyings.destroy({ where: { buyingId: buying.id, platformId, gameId } });
            return gameRemove;
        });
    }
    createPayment(email, price, games) {
        return __awaiter(this, void 0, void 0, function* () {
            //const date = qiwiAPI.getLifetimeByDay(0.01388888888);
            const date = qiwiAPI.getLifetimeByDay(0.00069444444);
            const id = uuid.v4();
            const prms = {
                amount: price,
                currency: "RUB",
                comment: "Test",
                expirationDateTime: date,
                successUrl: 'http://localhost:3000/profile/history',
            };
            //const link = await qiwiAPI.createPaymentForm(params);
            const link = yield qiwiAPI.createBill(id, prms);
            console.log("pay");
            const buyingId = yield Buying.findOne({ where: { userEmail: email, status: "Opened" } });
            buyingId.payLink = link.payUrl;
            buyingId.status = "Paying";
            yield buyingId.save();
            for (let i = 0; i < games.length; i++) {
                const game = yield GamesPlatformsBuyings.findOne({ where: { buyingId: buyingId.dataValues.id, gameId: games[i].id, platformId: games[i].platformId } });
                game.count = games[i].count;
                yield game.save();
                const keys = yield keys_service_1.default.bookKeys(buyingId.dataValues.id, games[i].id, games[i].platformId, games[i].count);
            }
            checkPayment(id, link.payUrl, email);
            return link;
        });
    }
}
exports.default = new BuyingsService();
