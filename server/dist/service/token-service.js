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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const { Token } = require("../models/models");
class TokenService {
    generateTokens(payload) {
        const accessToken = jsonwebtoken_1.default.sign(payload, process.env.KEY_JWT, { expiresIn: '30m' });
        const refreshToken = jsonwebtoken_1.default.sign(payload, process.env.REFRESH_JWT, { expiresIn: '30d' });
        return {
            token: accessToken,
            refresh: refreshToken
        };
    }
    validateAccessToken(token) {
        try {
            const userData = jsonwebtoken_1.default.verify(token, process.env.KEY_JWT);
            return userData;
        }
        catch (e) {
            return null;
        }
    }
    validateRefreshToken(token) {
        try {
            const userData = jsonwebtoken_1.default.verify(token, process.env.REFRESH_JWT);
            return userData;
        }
        catch (e) {
            return null;
        }
    }
    findToken(refresh) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield Token.findOne({ where: { refreshToken: refresh } });
            return token;
        });
    }
    registerToken(userEmail, refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenData = yield Token.findOne({ where: { userEmail } });
            if (tokenData) {
                tokenData.refreshToken = refreshToken;
                return tokenData.save();
            }
            const token = yield Token.create({ refreshToken, userEmail });
            return token;
        });
    }
    removeToken(refresh) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenData = yield Token.destroy({ where: {
                    refreshToken: refresh
                } });
            return tokenData;
        });
    }
    removeUserToken(userEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield Token.destroy({ where: { userEmail } });
            return token;
        });
    }
}
exports.default = new TokenService();
