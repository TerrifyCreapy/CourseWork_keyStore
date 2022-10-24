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
const uuid = require("uuid");
const path = require("path");
const { Games, GamesPlatforms, TagsGames, Keys, FeedBack } = require("../models/models");
const fs = require("fs");
class GamesController {
    getGames(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { tagid, platformid } = req.query;
                if (tagid && platformid) {
                    let gamesIdSTags = yield TagsGames.findAll({
                        attributes: ["gameId"],
                        where: {
                            tagId: tagid,
                        }
                    });
                    gamesIdSTags = gamesIdSTags.map((e) => e.dataValues.gameId);
                    let gamesIdSPlatforms = yield GamesPlatforms.findAll({
                        attributes: ["gameId"],
                        where: {
                            platformId: platformid
                        }
                    });
                    gamesIdSPlatforms = gamesIdSPlatforms.map((e) => e.dataValues.gameId);
                    gamesIdSPlatforms = Array.from(new Set(gamesIdSPlatforms));
                    gamesIdSTags = Array.from(new Set(gamesIdSTags));
                    let gamesArray = [];
                    for (let i = 0; i < gamesIdSTags.length; i++) {
                        if (gamesIdSPlatforms.indexOf(gamesIdSTags[i]) > -1) {
                            gamesArray.push(gamesIdSTags[i]);
                        }
                    }
                    let games = yield Games.findAndCountAll({
                        where: {
                            id: Array.from(gamesArray)
                        }
                    });
                    return res.json(games);
                }
                if (tagid && !platformid) {
                    let gamesIdS;
                    gamesIdS = yield TagsGames.findAll({
                        attributes: ["gameId"],
                        where: {
                            tagId: tagid
                        }
                    });
                    gamesIdS = gamesIdS.map((e) => e.dataValues.gameId);
                    gamesIdS = new Set(gamesIdS);
                    let games = yield Games.findAndCountAll({
                        where: {
                            id: Array.from(gamesIdS)
                        }
                    });
                    return res.json(games);
                }
                if (!tagid && platformid) {
                    let gamesIdSPlatform;
                    gamesIdSPlatform = yield GamesPlatforms.findAll({
                        attributes: ["gameId"],
                        where: {
                            platformId: platformid
                        }
                    });
                    gamesIdSPlatform = gamesIdSPlatform.map((e) => e.dataValues.gameId);
                    gamesIdSPlatform = new Set(gamesIdSPlatform);
                    let games = yield Games.findAndCountAll({
                        where: {
                            id: Array.from(gamesIdSPlatform)
                        }
                    });
                    return res.json(games);
                }
                const games = yield Games.findAndCountAll();
                return res.json(games);
            }
            catch (e) {
                return next(ApiError_1.default.badRequest(e.message));
            }
        });
    }
    addGames(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, price, platformsID, TagsID, description, discount, dateRealize } = req.body;
                const { img } = req.files;
                let fileName = uuid.v4() + ".jpg";
                img.mv(path.resolve(__dirname, '..', '..', 'static', fileName));
                const game = yield Games.create({ name, description, img: fileName, price, discount, dateAdd: (new Date()), dateRealize });
                let platformsIDjson = JSON.parse(platformsID);
                let TagsIDjson = JSON.parse(TagsID);
                for (let i = 0; i < platformsIDjson.length; i++) {
                    yield GamesPlatforms.create({ gameId: game.id, platformId: platformsIDjson[i] });
                }
                for (let i = 0; i < TagsIDjson.length; i++) {
                    yield TagsGames.create({ gameId: game.id, tagId: TagsIDjson[i] });
                }
                return res.status(201).json(game);
            }
            catch (e) {
                next(ApiError_1.default.badRequest(e.message));
            }
        });
    }
    getGame(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = +(req.params.id || -1);
                if (id === -1)
                    return next(ApiError_1.default.badRequest("Input id incorrect!"));
                const game = yield Games.findByPk(id);
                if (!game)
                    return res.sendStatus(404);
                return res.json(game);
            }
            catch (e) {
                return next(ApiError_1.default.badRequest(e.message));
            }
        });
    }
    editGame(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = +(req.params.id || -1);
                if (id === -1)
                    return next(ApiError_1.default.badRequest("Id error!"));
                let game = (yield Games.findByPk(id)).dataValues;
                const { name, price, description, discount, dateRealize, dateAdd } = req.body;
                const { img } = req.files;
                let fileName;
                if (img) {
                    fileName = uuid.v4() + ".jpg";
                    img.mv(path.resolve(__dirname, '..', '..', 'static', fileName));
                    try {
                        fs.unlinkSync(path.resolve(__dirname, '..', '..', 'static', game.img));
                    }
                    catch (e) {
                        console.error(e.message);
                    }
                }
                game = yield Games.update({
                    name,
                    description,
                    img: img ? fileName : game.img,
                    price,
                    discount,
                    dateRealize,
                    dateAdd
                }, {
                    where: {
                        id: id
                    }
                });
                return res.json(game);
            }
            catch (e) {
                return next(ApiError_1.default.badRequest(e.message));
            }
        });
    }
    editTags(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = +(req.params.id || -1);
                const tagId = req.body.tagid;
                if (id === -1 || !tagId)
                    return next(ApiError_1.default.badRequest("Invalid id of game or tag!"));
                const tag = yield TagsGames.findAll({ where: { gameId: id, tagId } });
                if (tag.length) {
                    yield TagsGames.destroy({
                        where: {
                            gameId: id,
                            tagId
                        }
                    });
                    return res.status(200).send("Removed!");
                }
                else {
                    yield TagsGames.create({ gameId: id, tagId });
                    return res.status(201).send("Added!");
                }
            }
            catch (e) {
                return next(ApiError_1.default.badRequest(e.message));
            }
        });
    }
    editPlatforms(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = +(req.params.id || -1);
                const platformId = req.body.platformid;
                if (id === -1 || !platformId)
                    return next(ApiError_1.default.badRequest("Invalid id of game or platform!"));
                const platform = yield GamesPlatforms.findAll({ where: { gameId: id, platformId } });
                if (platform.length) {
                    yield GamesPlatforms.destroy({
                        where: {
                            gameId: id,
                            platformId
                        }
                    });
                    return res.status(200).send("Removed!");
                }
                else {
                    yield GamesPlatforms.create({ gameId: id, platformId });
                    return res.status(201).send("Added!");
                }
            }
            catch (e) {
                return next(ApiError_1.default.badRequest(e.message));
            }
        });
    }
}
exports.default = (new GamesController());
