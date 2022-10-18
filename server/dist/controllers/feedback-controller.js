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
const { FeedBack } = require("../models/models");
class FeedBackController {
    addComments(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, value, gameID } = req.body;
            if (!name || !value)
                return next(ApiError_1.default.badRequest("Body of comment is empty!"));
            const comment = yield FeedBack.create({ name, value });
            return res.status(201).json(comment);
        });
    }
    getComments(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.body;
            if (!id)
                return next(ApiError_1.default.badRequest("Error with id of game!"));
            const commends = yield FeedBack.findAndCountAll({ where: { id } });
            return res.json(commends);
        });
    }
    removeComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                if (!id)
                    return next(ApiError_1.default.badRequest("Error with id of comment!"));
                const comment = yield FeedBack.destroy({ where: { id } });
                return res.json(comment);
            }
            catch (e) {
                return next(ApiError_1.default.badRequest(e.message));
            }
        });
    }
}
exports.default = (new FeedBackController());
