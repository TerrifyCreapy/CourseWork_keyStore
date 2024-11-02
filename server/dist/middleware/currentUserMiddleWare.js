"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentUser = void 0;
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const currentUser = (req, res, next) => {
    if (req.method === "OPTIONS") {
        next();
    }
    console.log(req.body.lastEmail, req.user.email, req.params.email);
    try {
        console.log(req.body.lastEmail === req.user.email, req.params.email === req.user.email);
        if (req.body.lastEmail === req.user.email || req.params.email === req.user.email) {
            req.currentUser = true;
        }
        else {
            req.currentUser = false;
        }
        console.log("next");
        next();
    }
    catch (e) {
        return next(ApiError_1.default.notAutorized());
    }
};
exports.currentUser = currentUser;
