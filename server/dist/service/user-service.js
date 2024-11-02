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
const { User, Buying, FeedBack } = require("../models/models");
function isExist(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield User.findByPk(email);
        if (user)
            return { exist: true };
        return { exits: false };
    });
}
class UserService {
    registration(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const candidate = yield isExist(email);
            if (candidate.exist) {
                throw ApiError_1.default.badRequest("User with current email already exist!");
            }
            const hashPass = yield bcrypt_1.default.hash(password, 5);
            const activationLink = uuid.v4();
            const user = yield User.create({ email, password: hashPass, roles: ["USER", "MODER", "ADMIN"], activetionLink: activationLink });
            const userBuy = yield Buying.create({ userEmail: email });
            yield mail_service_1.default.sendActivation(email, `${process.env.API_URL}/api/user/activate/${activationLink}`);
            const userJwt = {
                email: user.email,
                isActivated: user.isConfirmed,
                roles: user.roles
            };
            const tokens = token_service_1.default.generateTokens(Object.assign({}, userJwt));
            yield token_service_1.default.registerToken(userJwt.email, tokens.refresh);
            return Object.assign(Object.assign(Object.assign({}, tokens), userBuy), { user: userJwt });
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User.findOne({ where: { email } });
            console.log(user);
            if (!user)
                throw ApiError_2.default.badRequest(`User with ${email} not found`);
            const isPassEquals = yield bcrypt_1.default.compare(password, user.password);
            console.log(isPassEquals);
            if (!isPassEquals)
                throw ApiError_2.default.badRequest("Password is not correct");
            const userJwt = {
                email: user.email,
                isActivated: user.isConfirmed,
                roles: user.roles
            };
            console.log(userJwt);
            const tokens = token_service_1.default.generateTokens(Object.assign({}, userJwt));
            yield token_service_1.default.registerToken(userJwt.email, tokens.refresh);
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
            const nowUser = yield User.findByPk(userData.email);
            const userJwt = {
                email: nowUser.email,
                isActivated: nowUser.isConfirmed,
                roles: nowUser.roles
            };
            const tokens = token_service_1.default.generateTokens(Object.assign({}, userJwt));
            yield token_service_1.default.registerToken(userJwt.email, tokens.refresh);
            return Object.assign(Object.assign({}, tokens), { user: userJwt });
        });
    }
    sendMessage(email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email)
                throw ApiError_2.default.badRequest("Error with email of user");
            const user = yield User.findByPk(email);
            if (!user)
                throw ApiError_2.default.notFound("Not found user");
            console.log(user);
            yield mail_service_1.default.sendActivation(email, `${process.env.API_URL}/api/user/activate/${user.activetionLink}`);
        });
    }
    activate(link) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findLink = yield User.findOne({ where: { activetionLink: link } });
                if (!findLink)
                    throw ApiError_1.default.badRequest("Incorrect activation link");
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
    removeUser(userEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenRemoving = yield token_service_1.default.removeUserToken(userEmail);
            const feedbackRemoving = yield FeedBack.destroy({ where: { userEmail } });
            const buyingRemove = yield Buying.update({ userEmail: null }, { where: { userEmail } });
            const buyingRemoving = yield Buying.destroy({ where: { userEmail } });
            const userRemoving = yield User.destroy({ where: { email: userEmail } });
            return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, tokenRemoving), feedbackRemoving), userRemoving), buyingRemove), buyingRemoving);
        });
    }
    editProfile(email, lastEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email || !lastEmail)
                throw ApiError_1.default.badRequest("Error email");
            if (email === lastEmail)
                throw ApiError_2.default.badRequest("New and last email are similar");
            const userData = yield User.findByPk(lastEmail);
            if (!userData)
                throw ApiError_1.default.badRequest("Incorrect email");
            const exist = yield isExist(email);
            if (exist.exist)
                throw ApiError_2.default.badRequest("User already exists");
            const user = yield User.update({
                email: email,
                isConfirmed: false,
                activetionLink: uuid.v4()
            }, { where: { email: lastEmail } });
            const newUser = yield User.findByPk(email);
            const userJwt = {
                email: newUser.email,
                isActivated: newUser.isConfirmed,
                roles: newUser.roles
            };
            console.log(userJwt);
            const tokens = token_service_1.default.generateTokens(Object.assign({}, userJwt));
            yield token_service_1.default.registerToken(userJwt.email, tokens.refresh);
            return Object.assign(Object.assign({}, tokens), { user: userJwt });
        });
    }
    editPassword(email, lastPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!lastPassword || !newPassword)
                throw ApiError_2.default.badRequest("Error with new or last password");
            if (!email)
                throw ApiError_2.default.badRequest("Error with email of user");
            const user = yield User.findByPk(email);
            if (!user)
                throw ApiError_2.default.notFound("User not found");
            const comparePass = yield bcrypt_1.default.compare(lastPassword, user.password);
            if (!comparePass)
                throw ApiError_1.default.forbidden("Not correct password");
            const newPasswordHash = yield bcrypt_1.default.hash(newPassword, 5);
            user.password = newPasswordHash;
            yield user.save();
            return true;
        });
    }
    editUserRoles(email, roles) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email || !roles.length)
                throw ApiError_1.default.badRequest("Error email or roles");
            const userRoles = yield User.update({ roles: roles }, { where: {
                    email
                } });
            const tokenUpdate = yield token_service_1.default.removeUserToken(email);
            return Object.assign(Object.assign({}, userRoles), tokenUpdate);
        });
    }
    getUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email)
                throw ApiError_1.default.badRequest("No email");
            const user = yield User.findOne({ attributes: ["email", "isConfirmed", "roles", "createdAt"], where: { email } });
            return user;
        });
    }
}
exports.default = new UserService();
