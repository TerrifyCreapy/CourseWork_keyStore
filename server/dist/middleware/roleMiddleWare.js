"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiError_1 = __importDefault(require("../errors/ApiError"));
function default_1(roles) {
    return function (req, res, next) {
        var _a;
        if (req.method === "OPTIONS") {
            next();
        }
        try {
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
            if (!token) {
                return next(ApiError_1.default.notAutorized());
            }
            const userRoles = req.user.roles;
            roles.forEach((e) => {
                if (userRoles.indexOf(e) === -1) {
                    return next(ApiError_1.default.forbidden("Access denied"));
                }
            });
            next();
        }
        catch (e) {
            return next(ApiError_1.default.forbidden("Access denied"));
        }
    };
}
exports.default = default_1;
