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
const { Keys } = require("../models/models");
class KeysController {
    addKeys(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { value, platformId, gameId } = req.body;
                if (!value || !platformId || !gameId)
                    next(ApiError_1.default.badRequest("Error with key!"));
                const newKey = yield Keys.create({ value, platformId, gameId });
                return res.status(201).json(newKey);
            }
            catch (e) {
                return next(ApiError_1.default.badRequest(e.message));
            }
        });
    }
    getKey(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = +(req.params.id || -1);
                if (id === -1)
                    return next(ApiError_1.default.notFound("Not found"));
                const key = Keys.findByPk(id);
                return res.json(key);
            }
            catch (e) {
                return next(ApiError_1.default.badRequest(e.message));
            }
        });
    }
    removeKey(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = +(req.params.id || -1);
                if (id === -1)
                    return next(ApiError_1.default.notFound("Not found"));
                const key = Keys.destroy({
                    where: {
                        id
                    }
                });
                return res.json(key);
            }
            catch (e) {
                return next(ApiError_1.default.badRequest(e.message));
            }
        });
    }
    editKey(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = +(req.params.id || -1);
                if (id === -1)
                    return next(ApiError_1.default.notFound("Not found"));
                const { value, platformId, gameId } = req.body;
                if (!value || !platformId || !gameId)
                    next(ApiError_1.default.badRequest("Error with key!"));
                const key = yield Keys.update({
                    value,
                    platformId,
                    gameId
                }, {
                    where: {
                        id
                    }
                });
                return res.json(key);
            }
            catch (e) {
                return next(ApiError_1.default.badRequest(e.message));
            }
        });
    }
}
exports.default = (new KeysController());
