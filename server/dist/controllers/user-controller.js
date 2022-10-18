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
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty())
                    return next(ApiError_1.default.badRequest("Error validating", errors.array()));
                const { email, password } = req.body;
                const user = yield user_service_1.default.registration(email, password);
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
                const { email, password } = req.body;
                const user = yield user_service_1.default.login(email, password);
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
                const { refreshToken } = req.cookies;
                const token = yield user_service_1.default.logout(refreshToken);
                res.clearCookie('refreshToken');
                return res.json(token);
            }
            catch (e) {
                return next(e);
            }
        });
    }
    isAuth(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            /* const token = generateJwt(req.user.id, req.user.email, req.user.roles);
             return res.json({token});*/
        });
    }
    editUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    refresh(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const user = yield user_service_1.default.login(email, password);
                res.cookie('refreshToken', user.refresh, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
                return res.json(user);
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
    removeUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = +req.params.id;
                const rm = yield user_service_1.default.removeUser(id);
                return res.json(rm);
            }
            catch (e) {
                return next(e);
            }
        });
    }
}
exports.default = (new UserController());
