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
const keys_service_1 = __importDefault(require("../service/keys-service"));
class KeysController {
    addKeys(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { keyValue, platformId, gameId } = req.body;
                const newKey = yield keys_service_1.default.addKey(keyValue, platformId, gameId);
                return res.status(201).json(newKey);
            }
            catch (e) {
                return next(e);
            }
        });
    }
    getKey(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = +(req.params.id || -1);
                const { email } = req.body;
                const key = yield keys_service_1.default.getKey(id, email);
                return res.json(key);
            }
            catch (e) {
                return next(e);
            }
        });
    }
    removeKey(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = +(req.params.id || -1);
                const key = yield keys_service_1.default.removeKey(id);
                return res.json(key);
            }
            catch (e) {
                return next(e);
            }
        });
    }
    sendKeys(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userEmail, buyingId } = req.body;
                console.log(userEmail, buyingId);
                const keysgames = yield keys_service_1.default.takeBoughtKeys(userEmail, buyingId);
                return res.sendStatus(200);
            }
            catch (e) {
                return next(e);
            }
        });
    }
    editKey(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = +(req.params.id || -1);
                const { value, platformId, gameId } = req.body;
                const body = {
                    id,
                    value,
                    platformId: platformId === "NULL" ? null : platformId,
                    gameId: gameId === "NULL" ? null : gameId,
                };
                yield keys_service_1.default.editKey(body.id, body.value, body.platformId, body.gameId);
                return res.sendStatus(200);
            }
            catch (e) {
                return next(e);
            }
        });
    }
}
exports.default = (new KeysController());
