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
class FeedbackService {
    addComment(email, value, id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email || !value || !id)
                throw ApiError_1.default.badRequest("Error with email or  or id of game");
            if (value.length > 254)
                throw ApiError_1.default.badRequest("Too long message");
            const Feedback = yield FeedBack.create({ value, gameId: id, userEmail: email });
            return Feedback;
        });
    }
    getComments(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id)
                throw ApiError_1.default.badRequest("Error with id of game");
            const feedbacks = yield FeedBack.findAndCountAll({ where: { gameId: id } });
            return feedbacks;
        });
    }
    removeComment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id)
                throw ApiError_1.default.badRequest("Error with id of comment");
            const feedbackremove = yield FeedBack.destroy({ where: { id } });
            return feedbackremove;
        });
    }
    editComment(id, value) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id)
                throw ApiError_1.default.badRequest("Error with id of comment");
            if (!value)
                throw ApiError_1.default.badRequest("Error with value of comment");
            if (value.length > 254)
                throw ApiError_1.default.badRequest("Too long message");
            const comment = yield FeedBack.update({ value }, { where: { id } });
            return comment;
        });
    }
}
exports.default = new FeedbackService();
