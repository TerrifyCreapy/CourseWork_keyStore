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
const { Keys, Buying } = require("../models/models");
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
            const userEmail = yield this.isBought(id);
            if (email !== userEmail)
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
    isBought(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (id === -1)
                throw ApiError_1.default.internal("internal error");
            const key = yield Keys.findByPk(id);
            if (!key)
                throw ApiError_1.default.notFound("Not found");
            if (!key.buyingId)
                throw ApiError_1.default.forbidden("Access denied");
            const buying = yield Buying.findByPk(key.buyingId);
            if (!buying)
                throw ApiError_1.default.internal("Internal error");
            return buying.userEmail;
        });
    }
}
exports.default = new KeysService();
