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
const feedback_service_1 = __importDefault(require("../service/feedback-service"));
const { FeedBack } = require("../models/models");
class FeedBackController {
    addComments(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, value, gameID } = req.body;
                const comment = yield feedback_service_1.default.addComment(email, value, gameID);
                return res.status(201).json(comment);
            }
            catch (e) {
                return next(e);
            }
        });
    }
    getComments(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const comments = yield feedback_service_1.default.getComments(+id);
                return res.json(comments);
            }
            catch (e) {
                return next(e);
            }
        });
    }
    removeComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = +req.params.id;
                const comment = yield feedback_service_1.default.removeComment(id);
                return res.json(comment);
            }
            catch (e) {
                return next(e);
            }
        });
    }
    editComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = +req.params.id;
                const value = req.body;
                const comment = yield feedback_service_1.default.editComment(id, value);
                return res.json(comment);
            }
            catch (e) {
                return next(e);
            }
        });
    }
}
exports.default = (new FeedBackController());
