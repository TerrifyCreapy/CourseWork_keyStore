"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRoles = void 0;
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const isRoles = (roles) => {
    return function (req, res, next) {
        if (req.method === "OPTIONS") {
            next();
        }
        if (req.currentUser === true)
            return next();
        try {
            const userRoles = req.user.roles;
            roles.forEach((e) => {
                console.log(e);
                if (userRoles.indexOf(e) === -1) {
                    return next(ApiError_1.default.forbidden("Access denied"));
                }
            });
            console.log("next");
            next();
        }
        catch (e) {
            return next(ApiError_1.default.forbidden("Access denied"));
        }
    };
};
exports.isRoles = isRoles;
