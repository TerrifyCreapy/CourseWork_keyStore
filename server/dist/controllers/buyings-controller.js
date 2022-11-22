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
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const buyings_service_1 = __importDefault(require("../service/buyings-service"));
const keys_service_1 = __importDefault(require("../service/keys-service"));
const { Buying, GamesPlatformsBuyings, Games, Platforms } = require("../models/models");
class BuyingController {
    getBasket(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.user;
                const basket = yield buyings_service_1.default.getBasket(email);
                return res.json(basket[0]);
            }
            catch (e) {
                return next(e);
            }
        });
    }
    getHistory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.user;
                const history = yield buyings_service_1.default.getHistory(email);
                return res.json(history);
            }
            catch (e) {
                return next(e);
            }
        });
    }
    getAllGamesBougth(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.user;
                console.log(email, 123);
                const games = yield buyings_service_1.default.getBuyingGames(email);
                return res.json(games);
            }
            catch (e) {
                return next(e);
            }
        });
    }
    addGame(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { email, platformId, gameId, count } = req.body;
                const game = buyings_service_1.default.addGame(email, platformId, gameId, count == null ? count : 1);
                return res.json(game);
            }
            catch (e) {
                return next(e);
            }
        });
    }
    removeGame(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { email } = req.user;
                let { platformId, gameId } = req.body;
                const game = buyings_service_1.default.removeGame(email, platformId, gameId);
                return res.json(game);
            }
            catch (e) {
                return next(e);
            }
        });
    }
    getBuyings(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const buyings = yield buyings_service_1.default.getBuyings(email);
                return res.json(buyings);
            }
            catch (e) {
                return next(e);
            }
        });
    }
    //TODO pay for user
    createPayment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, price, games } = req.body;
                console.log(price);
                const isKeys = yield keys_service_1.default.checkKeys(games);
                if (!isKeys)
                    return next(ApiError_1.default.badRequest("Not enough keys!"));
                const link = yield buyings_service_1.default.createPayment(email, price, games);
                return res.json(link);
            }
            catch (e) {
                return next(e);
            }
        });
    }
    test(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const gamesplats = yield GamesPlatformsBuyings.findAll({ where: { buyingId: 2 } });
            const gamesPlatforms = [];
            for (let i = 0; i < gamesplats.length; i++) {
                const tGame = yield Games.findOne({ attributes: ["id", "name", "img", "price", "discount"], where: { id: gamesplats[i].dataValues.gameId } });
                const tPlatform = yield Platforms.findOne({ attributes: ["id", "name"], where: { id: gamesplats[i].dataValues.platformId } });
                gamesPlatforms.push(Object.assign(Object.assign({}, tGame.dataValues), { platform: tPlatform }));
            }
            const platforms = yield Platforms.findAll({ where: { id: gamesplats.map((e) => e.dataValues.platformId) } });
            const games = yield Games.findAll({ attributes: ["id", "name", "img", "price", "discount"], where: { id: gamesplats.map((e) => e.dataValues.gameId) } });
            return res.json(gamesPlatforms);
        });
    }
}
exports.default = (new BuyingController());
