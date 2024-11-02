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
const { Platforms } = require("../models/models");
class PlatformsController {
    getPlatforms(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(123);
                const platforms = yield Platforms.findAndCountAll();
                return res.json(platforms);
            }
            catch (e) {
                return next(e);
            }
        });
    }
    addPlatform(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name } = req.body;
                if (!name)
                    return next(ApiError_1.default.badRequest("Inserting name of platform is empty! Insert name."));
                const platform = yield Platforms.create({ name });
                return res.json(platform);
            }
            catch (e) {
                return next(e);
            }
        });
    }
    editPlatform(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { name } = req.body;
                if (!name || !id)
                    return next(ApiError_1.default.badRequest("Error"));
                const platform = yield Platforms.findByPk(id);
                if (!platform)
                    return next(ApiError_1.default.notFound("Not found"));
                platform.name = name;
                yield platform.save();
                return res.sendStatus(200);
            }
            catch (e) {
                return next(e);
            }
        });
    }
    removePlatform(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                console.log(123, "next");
                if (!id)
                    return next(ApiError_1.default.badRequest("Error"));
                const platform = yield Platforms.destroy({ where: { id } });
                return res.json(platform);
            }
            catch (e) {
                return next(e);
            }
        });
    }
}
exports.default = (new PlatformsController());
