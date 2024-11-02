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
const mail_service_1 = __importDefault(require("./mail-service"));
const sequelize = require("sequelize");
const { Keys, Buying, GamesPlatformsBuyings, Games, Platforms } = require("../models/models");
const removeCompared = (arr) => {
    return arr.reduce((o, i) => {
        if (!o.find((v) => (v.gameId == i.gameId && v.platformId == i.platformId))) {
            o.push(i);
        }
        return o;
    }, []);
};
class KeysService {
    addKey(value, platformId, gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!value || !platformId || !gameId)
                throw ApiError_1.default.badRequest("Error with key!");
            const newKey = yield Keys.create({ value, buyId: null, platformId, gameId, });
            return newKey;
        });
    }
    getKey(id, email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (id === -1)
                throw ApiError_1.default.notFound("Not found");
            if (!email)
                throw ApiError_1.default.forbidden("Access denied");
            const key = yield Keys.findByPk(id);
            return key;
        });
    }
    removeKey(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (id === -1)
                throw ApiError_1.default.notFound("Not found");
            const key = Keys.destroy({
                where: {
                    id
                }
            });
            return key;
        });
    }
    editKey(id, value, platformId, gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (id === -1)
                throw ApiError_1.default.notFound("Not found");
            if (!value && !platformId && !gameId)
                throw ApiError_1.default.badRequest("Error with key!");
            const key = yield Keys.findByPk(id);
            if (!key)
                throw ApiError_1.default.badRequest("Error with key");
            if (value.length)
                key.value = value;
            if (platformId !== null)
                key.platformId = platformId;
            if (gameId !== null)
                key.gameId = gameId;
            yield key.save();
            console.log("saved");
        });
    }
    bookKeys(buyId, gameId, platformId, count) {
        return __awaiter(this, void 0, void 0, function* () {
            let keys = yield Keys.findAndCountAll({ where: { gameId, platformId } });
            if (!keys)
                return false;
            for (let i = 0; i < count; i++) {
                keys.rows[i].buyingId = buyId;
                yield keys.rows[i].save();
            }
            return true;
        });
    }
    deleteBookKeys(buyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const keys = yield Keys.findAndCountAll({ where: { buyingId: buyId } });
            for (let i = 0; i < keys.rows.length; i++) {
                keys.rows[i].buyingId = null;
                yield keys.rows[i].save();
            }
            const gamesplatsbuys = yield GamesPlatformsBuyings.findAndCountAll({ where: { buyingId: buyId } });
            for (let i = 0; i < gamesplatsbuys.rows.length; i++) {
                gamesplatsbuys.rows[i].count = 1;
                yield gamesplatsbuys.rows[i].save();
            }
            return true;
        });
    }
    checkKeys(games) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < games.length; i++) {
                const keys = yield Keys.findAndCountAll({ where: { gameId: games[i].id, platformId: games[i].platformId, buyingId: null } });
                if (keys.count < games[i].count)
                    return false;
            }
            return true;
        });
    }
    takeBoughtKeys(email, buyingId) {
        return __awaiter(this, void 0, void 0, function* () {
            let keys = yield Keys.findAll({ attributes: ["gameId", "platformId"], where: { buyingId } });
            if (!keys)
                throw ApiError_1.default.badRequest("No keys in buying!");
            keys = JSON.parse(JSON.stringify(removeCompared(keys)));
            let gamesPlatforms = [];
            for (let i = 0; i < keys.length; i++) {
                console.log(keys[i].gameId, keys[i].platformId);
                const game = yield Games.findByPk(keys[i].gameId);
                console.log(game);
                const platform = yield Platforms.findByPk(keys[i].platformId);
                const key = yield Keys.findAll({ attributes: ["value"], where: {
                        buyingId,
                        gameId: keys[i].gameId,
                        platformId: keys[i].platformId
                    } });
                keys[i] = Object.assign(Object.assign({}, keys[i]), { gameName: game.name, platformName: platform.name, keys: key.map((e) => e.value) });
            }
            let res = yield mail_service_1.default.sendKeys(email, keys, buyingId);
            return res;
        });
    }
}
exports.default = new KeysService();
