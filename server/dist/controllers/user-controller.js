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
class UserController {
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    registration(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    isAuth(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.query.id)
                return next(ApiError_1.default.badRequest("No id!"));
            return res.json(req.query);
        });
    }
    editUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.default = (new UserController());
