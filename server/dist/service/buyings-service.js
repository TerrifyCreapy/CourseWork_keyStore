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
const { Buying, GamesPlatformsBuyings } = require("../models/models");
function findBuys(userEmail, platformId, gameId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!userEmail || !platformId || !gameId)
            throw ApiError_1.default.badRequest("Error");
        const buying = yield Buying.findAll({ where: { userEmail, status: "Opened" } });
        if (!buying)
            throw ApiError_1.default.internal("Internal error");
        return buying;
    });
}
class BuyingsService {
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
    setStatusPaying(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id)
                throw ApiError_1.default.badRequest("Error with id of buying");
            if (!status)
                throw ApiError_1.default.badRequest("Error with status");
            const buying = yield Buying.findByPk(id);
            if (!buying)
                throw ApiError_1.default.notFound("Not found buying");
            buying.status = status;
            yield buying.save();
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
            let connection = yield GamesPlatformsBuyings.findAll({ where: { buyingId: buying.id, gameId, platformId } });
            if (!connection) {
                const newConnection = yield GamesPlatformsBuyings.create({ buyingId: buying.id, gameId, platformId });
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
}
exports.default = new BuyingsService();
