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
const user_service_1 = __importDefault(require("../service/user-service"));
const express_validator_1 = require("express-validator");
class UserController {
    registration(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //validation middleware
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty())
                    return next(ApiError_1.default.badRequest("Error validating", errors.array()));
                //taking info from registration body
                const { email, password } = req.body;
                const user = yield user_service_1.default.registration(email, password);
                //refreshToken and returning user
                res.cookie('refreshToken', user.refresh, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
                return res.json(user);
            }
            catch (e) {
                return next(e);
            }
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //taking info from login body
                const { email, password } = req.body;
                const user = yield user_service_1.default.login(email, password);
                //if true returning refresh token and user
                res.cookie('refreshToken', user.refresh, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
                return res.json(user);
            }
            catch (e) {
                return next(e);
            }
        });
    }
    logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //taking refresh token
                const { refreshToken } = req.cookies;
                //removing tokens and clearing cookies
                const token = yield user_service_1.default.logout(refreshToken);
                res.clearCookie('refreshToken');
                return res.json(token);
            }
            catch (e) {
                return next(e);
            }
        });
    }
    editUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, lastEmail } = req.body;
                const user = yield user_service_1.default.editProfile(email, lastEmail);
                res.cookie('refreshToken', user.refresh, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
                return res.json(user);
            }
            catch (e) {
                return next(e);
            }
        });
    }
    editPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.params;
                const { last, New } = req.body;
                const status = yield user_service_1.default.editPassword(email, last, New);
                res.sendStatus(200);
            }
            catch (e) {
                return next(e);
            }
        });
    }
    editRoles(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { roles } = req.body;
                const { email } = req.params;
                const newUser = user_service_1.default.editUserRoles(email, roles);
                return res.json(newUser);
            }
            catch (e) {
                return next(e);
            }
        });
    }
    refresh(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { refreshToken } = req.cookies;
                const user = yield user_service_1.default.refresh(refreshToken);
                res.cookie('refreshToken', user.refresh, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
                return res.json(user);
            }
            catch (e) {
                return next(e);
            }
        });
    }
    sendMessage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const sending = yield user_service_1.default.sendMessage(email);
                return res.sendStatus(200);
            }
            catch (e) {
                return next(e);
            }
        });
    }
    activateAccount(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { link } = req.params;
                const user = yield user_service_1.default.activate(link);
                return res.redirect(process.env.CLIENT_URL);
            }
            catch (e) {
                return next(e);
            }
        });
    }
    getUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield user_service_1.default.getUsers();
                return res.json(users);
            }
            catch (e) {
                return next(e);
            }
        });
    }
    getUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.params;
                const user = yield user_service_1.default.getUser(email);
                return res.json(user);
            }
            catch (e) {
                return next(e);
            }
        });
    }
    removeUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.params.email;
                const rm = yield user_service_1.default.removeUser(email);
                return res.json(rm);
            }
            catch (e) {
                return next(e);
            }
        });
    }
}
exports.default = (new UserController());
