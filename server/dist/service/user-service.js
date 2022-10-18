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
const bcrypt_1 = __importDefault(require("bcrypt"));
const mail_service_1 = __importDefault(require("./mail-service"));
const ApiError_2 = __importDefault(require("../errors/ApiError"));
const token_service_1 = __importDefault(require("./token-service"));
const uuid = require("uuid");
const { User, Basket, Buying } = require("../models/models");
class UserService {
    registration(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const candidate = yield User.findOne({ where: { email } });
            if (candidate) {
                return ApiError_1.default.badRequest("User with current email already exist!");
            }
            const hashPass = yield bcrypt_1.default.hash(password, 5);
            const activationLink = uuid.v4();
            const user = yield User.create({ email, password: hashPass, roles: ["USER"], activetionLink: activationLink });
            const basket = yield Basket.create({ userId: user.id });
            yield mail_service_1.default.sendActivation(email, `${process.env.API_URL}/api/user/activate/${activationLink}`);
            const userJwt = {
                email: user.dataValues.email,
                id: user.dataValues.id,
                isActivated: user.dataValues.isConfirmed,
                roles: user.dataValues.roles
            };
            const tokens = token_service_1.default.generateTokens(Object.assign({}, userJwt));
            yield token_service_1.default.registerToken(userJwt.id, tokens.refresh);
            return Object.assign(Object.assign({}, tokens), { user: userJwt });
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User.findOne({ where: { email } });
            if (!user)
                throw ApiError_2.default.badRequest(`User with ${email} not found`);
            const isPassEquals = yield bcrypt_1.default.compare(password, user.password);
            if (!isPassEquals)
                throw ApiError_2.default.badRequest("Password is not correct");
            const userJwt = {
                email: user.email,
                id: user.id,
                isActivated: user.isConfirmed,
                roles: user.roles
            };
            const tokens = token_service_1.default.generateTokens(Object.assign({}, userJwt));
            yield token_service_1.default.registerToken(userJwt.id, tokens.refresh);
            return Object.assign(Object.assign({}, tokens), { user: userJwt });
        });
    }
    logout(refresh) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield token_service_1.default.removeToken(refresh);
            return token;
        });
    }
    refresh(refresh) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!refresh)
                throw ApiError_2.default.notAutorized();
            const userData = token_service_1.default.validateRefreshToken(refresh);
            const tokenDB = yield token_service_1.default.findToken(refresh);
            if (!userData || !tokenDB) {
                throw ApiError_2.default.notAutorized();
            }
            const nowUser = yield User.findByPk(userData.id);
            const userJwt = {
                email: nowUser.email,
                id: nowUser.id,
                isActivated: nowUser.isConfirmed,
                roles: nowUser.roles
            };
            const tokens = token_service_1.default.generateTokens(Object.assign({}, userJwt));
            yield token_service_1.default.registerToken(userJwt.id, tokens.refresh);
            return Object.assign(Object.assign({}, tokens), { user: userJwt });
        });
    }
    activate(link) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findLink = yield User.findOne({ where: { activetionLink: link } });
                if (!findLink)
                    return ApiError_1.default.badRequest("Incorrect activation link");
                findLink.isConfirmed = true;
                yield findLink.save();
            }
            catch (e) {
                return ApiError_1.default.badRequest("Error");
            }
        });
    }
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield User.findAll();
            return users;
        });
    }
    removeUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenRemoving = yield token_service_1.default.removeUserToken(id);
            const basketRemoving = yield Basket.destroy({ where: { userId: id } });
            const buyingsRemoving = yield Buying.destroy({ where: { userId: id } });
            const userRemoving = yield User.destroy({ where: { id } });
            return Object.assign(Object.assign(Object.assign(Object.assign({}, tokenRemoving), basketRemoving), buyingsRemoving), userRemoving);
        });
    }
}
exports.default = new UserService();
