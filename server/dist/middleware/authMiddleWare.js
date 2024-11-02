"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const token_service_1 = __importDefault(require("../service/token-service"));
const isAuth = (req, res, next) => {
    var _a;
    if (req.method === "OPTIONS") {
        next();
    }
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token) {
            return next(ApiError_1.default.notAutorized());
        }
        const userData = token_service_1.default.validateAccessToken(token);
        if (!userData)
            return next(ApiError_1.default.notAutorized());
        req.user = userData;
        console.log(req.user);
        next();
    }
    catch (e) {
        return next(ApiError_1.default.notAutorized());
    }
};
exports.isAuth = isAuth;
