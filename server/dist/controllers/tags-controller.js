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
const { Tags } = require("../models/models");
class TagsController {
    getTags(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tags = yield Tags.findAll();
            return res.json(tags);
        });
    }
    addTags(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name } = req.body;
                if (!{ name })
                    return next(ApiError_1.default.badRequest("Need a name of tag!"));
                const tag = yield Tags.create({ name });
                return res.json(tag);
            }
            catch (e) {
                return next(ApiError_1.default.badRequest(e.message));
            }
        });
    }
}
exports.default = (new TagsController());
