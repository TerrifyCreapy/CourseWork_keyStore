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
const buyings_service_1 = __importDefault(require("../service/buyings-service"));
const { Buying } = require("../models/models");
class BuyingController {
    setStatusPaying(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, email } = req.body;
                yield buyings_service_1.default.setStatusPaying(id, "Pay");
                const newBuy = buyings_service_1.default.createNewBuing(email);
                return res.json(newBuy);
            }
            catch (e) {
                return next(e);
            }
        });
    }
    addGame(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { email, platformId, gameId, count } = req.body;
                const game = buyings_service_1.default.addGame(email, platformId, gameId, count);
                return res.json(game);
            }
            catch (e) {
                return next(e);
            }
        });
    }
    removeGame(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { email, platformId, gameId } = req.body;
                const game = buyings_service_1.default.removeGame(email, platformId, gameId);
                return res.json(game);
            }
            catch (e) {
                return next(e);
            }
        });
    }
    getBuyings(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const buyings = yield buyings_service_1.default.getBuyings(email);
                return res.json(buyings);
            }
            catch (e) {
                return next(e);
            }
        });
    }
    //TODO pay for user
    checkPayment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    setStatusClosed(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.body;
                yield buyings_service_1.default.setStatusPaying(id, "Closed");
                return res.json(200);
            }
            catch (e) {
                return next(e);
            }
        });
    }
}
exports.default = (new BuyingController());
