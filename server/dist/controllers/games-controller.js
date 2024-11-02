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
const sequelize_1 = require("sequelize");
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const uuid = require("uuid");
const path = require("path");
const { Games, GamesPlatforms, TagsGames, Keys, FeedBack } = require("../models/models");
const fs = require("fs");
function findPlatforms(games) {
    return __awaiter(this, void 0, void 0, function* () {
        const platformsIds = [];
        if (!games.rows) {
            const gamePlat = yield GamesPlatforms.findAll({ where: { gameId: games.id } });
            const tempArr = [];
            for (let i = 0; i < gamePlat.length; i++) {
                tempArr.push(gamePlat[i].dataValues.platformId);
            }
            return tempArr;
        }
        for (let i = 0; i < games.rows.length; i++) {
            const t = (yield GamesPlatforms.findAll({ attributes: ['platformId'], where: { gameId: games.rows[i].id } }));
            const tempArr = [];
            for (let j = 0; j < t.length; j++) {
                tempArr.push(t[j].dataValues.platformId);
            }
            platformsIds.push({ gameId: games.rows[i].id, platformsId: tempArr });
        }
        return platformsIds;
    });
}
class GamesController {
    getGames(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { tagid, platformid, limit, page, title } = req.query;
                if (tagid)
                    tagid = tagid.split('.');
                if (!title)
                    title = "%%";
                else
                    title = `%${title}%`;
                const nowPage = page === undefined ? 1 : +page;
                const nowLimin = limit === undefined ? 5 : +limit;
                let offset = nowPage * nowLimin - nowLimin;
                let games = null;
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
                    console.log(gamesArray);
                    games = yield Games.findAndCountAll({
                        where: {
                            id: Array.from(gamesArray),
                            name: {
                                [sequelize_1.Op.iLike]: title
                            }
                        },
                        limit,
                        offset
                    });
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
                    games = yield Games.findAndCountAll({
                        where: {
                            id: Array.from(gamesIdS),
                            name: {
                                [sequelize_1.Op.iLike]: title
                            }
                        },
                        limit,
                        offset,
                    });
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
                    games = yield Games.findAndCountAll({
                        where: {
                            id: Array.from(gamesIdSPlatform),
                            name: {
                                [sequelize_1.Op.iLike]: title
                            }
                        },
                        limit, offset
                    });
                }
                if (!tagid && !platformid) {
                    games = yield Games.findAndCountAll({ where: { name: { [sequelize_1.Op.iLike]: title } }, limit, offset });
                }
                const platforms = yield findPlatforms(games);
                return res.json({ games, platforms });
            }
            catch (e) {
                return next(ApiError_1.default.badRequest(e.message));
            }
        });
    }
    addGames(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //console.log((req as MulterRequest).files);
                const { name, price, platformsId, tagsId, description, discount, dateRealize } = req.body;
                const { img } = req.files;
                console.log(description);
                let fileName = uuid.v4() + ".jpg";
                img.mv(path.resolve(__dirname, '..', '..', 'static', fileName));
                const game = yield Games.create({ name, description, img: fileName, price, discount, dateAdd: (new Date()), dateRealize });
                let platformsIDjson = JSON.parse(platformsId);
                let TagsIDjson = JSON.parse(tagsId);
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
                if (id === -1 || isNaN(id))
                    return next(ApiError_1.default.badRequest("Input id incorrect!"));
                const game = yield Games.findByPk(id);
                const platforms = yield findPlatforms(game);
                if (!game)
                    return res.sendStatus(404);
                return res.json({ game, platforms });
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
    deleteGame(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id)
                    return next(ApiError_1.default.badRequest("Error with id of game"));
                const gameImg = yield Games.findByPk(id);
                try {
                    fs.unlinkSync(path.resolve(__dirname, '..', '..', 'static', gameImg.img));
                }
                catch (e) {
                    console.error(e.message);
                }
                const platforms = yield GamesPlatforms.destroy({ where: { gameId: id } });
                const tags = yield TagsGames.destroy({ where: { gameId: id } });
                const game = yield Games.destroy({ where: { id } });
                return res.json(Object.assign(Object.assign(Object.assign({}, platforms), tags), game));
            }
            catch (e) {
                return next(ApiError_1.default.badRequest(e.message));
            }
        });
    }
}
exports.default = (new GamesController());
