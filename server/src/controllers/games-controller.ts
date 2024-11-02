import { Request, Response } from "express";
import { NextFunction } from "express-serve-static-core";
import { Op } from "sequelize";
import APIError from "../errors/ApiError";
const uuid = require("uuid");
const path = require("path");
const { Games, GamesPlatforms, TagsGames, Keys, FeedBack } = require("../models/models");
const fs = require("fs");

interface MulterRequest extends Request {
    files: any;
}

async function findPlatforms(games: any) {
    const platformsIds = [];

    if (!games.rows) {

        const gamePlat = await GamesPlatforms.findAll({ where: { gameId: games.id } });
        const tempArr = [];
        for (let i = 0; i < gamePlat.length; i++) {
            tempArr.push(gamePlat[i].dataValues.platformId);
        }
        return tempArr;

    }

    for (let i = 0; i < games.rows.length; i++) {
        const t = (await GamesPlatforms.findAll({ attributes: ['platformId'], where: { gameId: games.rows[i].id } }));
        const tempArr = [];
        for (let j = 0; j < t.length; j++) {
            tempArr.push(t[j].dataValues.platformId);
        }
        platformsIds.push({ gameId: games.rows[i].id, platformsId: tempArr });
    }
    return platformsIds;
}


class GamesController {
    async getGames(req: Request, res: Response, next: Function) {
        try {
            let { tagid, platformid, limit, page, title} = req.query; 
            if (tagid) tagid = (tagid as string).split('.');
            if(!title)
                title = "%%";
            else    
                title = `%${title}%`;
            const nowPage: number = page === undefined ? 1 : +page;
            const nowLimin: number = limit === undefined ? 5 : +limit;
            let offset = nowPage * nowLimin - nowLimin;


            let games: any = null;

            if (tagid && platformid) {

                let gamesIdSTags = await TagsGames.findAll({
                    attributes: ["gameId"],
                    where: {
                        tagId: tagid,
                    }
                });
                gamesIdSTags = gamesIdSTags.map((e: any) => e.dataValues.gameId);

                let gamesIdSPlatforms = await GamesPlatforms.findAll({
                    attributes: ["gameId"],
                    where: { 
                        platformId: platformid
                    }
                })

                gamesIdSPlatforms = gamesIdSPlatforms.map((e: any) => e.dataValues.gameId);
                gamesIdSPlatforms = Array.from(new Set(gamesIdSPlatforms));
                gamesIdSTags = Array.from(new Set(gamesIdSTags));

                let gamesArray = [];
                for (let i = 0; i < gamesIdSTags.length; i++) {
                    if (gamesIdSPlatforms.indexOf(gamesIdSTags[i]) > -1) {
                        gamesArray.push(gamesIdSTags[i]);
                    }
                }
                console.log(gamesArray);


                games = await Games.findAndCountAll({
                    where: {
                        id: Array.from(gamesArray),
                        name: {
                            [Op.iLike]: title
                        }
                    },
                    limit,
                    offset
                });
            }
            if (tagid && !platformid) {
                let gamesIdS: any;
                gamesIdS = await TagsGames.findAll({
                    attributes: ["gameId"],
                    where: {
                        tagId: tagid
                    }
                });
                gamesIdS = gamesIdS.map((e: any) => e.dataValues.gameId);
                gamesIdS = new Set(gamesIdS);


                games = await Games.findAndCountAll({
                    where: {
                        id: Array.from(gamesIdS),
                        name: {
                            [Op.iLike]: title 
                        }
                    },
                    limit,
                    offset,
                });
            }
            if (!tagid && platformid) {
                let gamesIdSPlatform: any;
                gamesIdSPlatform = await GamesPlatforms.findAll({
                    attributes: ["gameId"],
                    where: {
                        platformId: platformid
                    }
                });
                gamesIdSPlatform = gamesIdSPlatform.map((e: any) => e.dataValues.gameId);
                gamesIdSPlatform = new Set(gamesIdSPlatform);


                games = await Games.findAndCountAll({
                    where: {
                        id: Array.from(gamesIdSPlatform),
                        name: {
                            [Op.iLike]: title
                        }
                    },
                    limit, offset
                });
            }
            if (!tagid && !platformid) {
                games = await Games.findAndCountAll({where: {name: {[Op.iLike]: title}}, limit, offset });
            }

            const platforms = await findPlatforms(games);
            return res.json({ games, platforms });
        }
        catch (e: any) {
            return next(APIError.badRequest(e.message))
        }
    }

    async addGames(req: Request, res: Response, next: Function) {
        try {
            //console.log((req as MulterRequest).files);
            const { name, price, platformsId, tagsId, description, discount, dateRealize } = req.body;
            const { img } = (req as MulterRequest).files;
            console.log(description);
            let fileName = uuid.v4() + ".jpg";
            img.mv(path.resolve(__dirname, '..', '..', 'static', fileName));

            const game = await Games.create({ name, description, img: fileName, price, discount, dateAdd: (new Date()), dateRealize });

            let platformsIDjson = JSON.parse(platformsId);
            let TagsIDjson = JSON.parse(tagsId);

            for (let i = 0; i < platformsIDjson.length; i++) {
                await GamesPlatforms.create({ gameId: game.id, platformId: platformsIDjson[i] });
            }
            for (let i = 0; i < TagsIDjson.length; i++) {
                await TagsGames.create({ gameId: game.id, tagId: TagsIDjson[i] });
            }

            return res.status(201).json(game);
        }
        catch (e: any) {
            next(APIError.badRequest(e.message));
        }


    }

    async getGame(req: Request, res: Response, next: Function) {
        try {
            const id: number = +(req.params.id || -1);
            if (id === -1 || isNaN(id)) return next(APIError.badRequest("Input id incorrect!"));
            const game = await Games.findByPk(id);
            const platforms = await findPlatforms(game);
            if (!game) return res.sendStatus(404);
            return res.json({ game, platforms });
        }
        catch (e: any) {
            return next(APIError.badRequest(e.message));
        }

    }
    async editGame(req: Request, res: Response, next: Function) {
        try {
            const id: number = +(req.params.id || -1);
            if (id === -1) return next(APIError.badRequest("Id error!"));
            let game = (await Games.findByPk(id)).dataValues;
            const { name, price, description, discount, dateRealize, dateAdd } = req.body;
            const { img } = (req as MulterRequest).files;
            let fileName;
            if (img) {
                fileName = uuid.v4() + ".jpg";
                img.mv(path.resolve(__dirname, '..', '..', 'static', fileName));
                try {
                    fs.unlinkSync(path.resolve(__dirname, '..', '..', 'static', game.img));
                }
                catch (e: any) {
                    console.error(e.message);
                }
            }
            game = await Games.update(
                {
                    name,
                    description,
                    img: img ? fileName : game.img,
                    price,
                    discount,
                    dateRealize,
                    dateAdd
                },
                {
                    where: {
                        id: id
                    }
                }
            )
            return res.json(game);

        }
        catch (e: any) {
            return next(APIError.badRequest(e.message));
        }
    }

    async editTags(req: Request, res: Response, next: Function) {
        try {
            const id: number = +(req.params.id || -1);
            const tagId: number = req.body.tagid;
            if (id === -1 || !tagId) return next(APIError.badRequest("Invalid id of game or tag!"));

            const tag = await TagsGames.findAll({ where: { gameId: id, tagId } });

            if (tag.length) {
                await TagsGames.destroy({
                    where: {
                        gameId: id,
                        tagId
                    }
                });
                return res.status(200).send("Removed!");
            }
            else {
                await TagsGames.create({ gameId: id, tagId });
                return res.status(201).send("Added!");
            }
        }
        catch (e: any) {
            return next(APIError.badRequest(e.message));
        }
    }

    async editPlatforms(req: Request, res: Response, next: Function) {
        try {
            const id: number = +(req.params.id || -1);
            const platformId: number = req.body.platformid;
            if (id === -1 || !platformId) return next(APIError.badRequest("Invalid id of game or platform!"));

            const platform = await GamesPlatforms.findAll({ where: { gameId: id, platformId } });

            if (platform.length) {
                await GamesPlatforms.destroy({
                    where: {
                        gameId: id,
                        platformId
                    }
                });
                return res.status(200).send("Removed!");
            }
            else {
                await GamesPlatforms.create({ gameId: id, platformId });
                return res.status(201).send("Added!");
            }
        }
        catch (e: any) {
            return next(APIError.badRequest(e.message));
        }
    }

    async deleteGame(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            if (!id) return next(APIError.badRequest("Error with id of game"));
            const gameImg = await Games.findByPk(id);
            try {
                fs.unlinkSync(path.resolve(__dirname, '..', '..', 'static', gameImg.img));
            }
            catch (e: any) {
                console.error(e.message);
            }
            const platforms = await GamesPlatforms.destroy({ where: { gameId: id } });
            const tags = await TagsGames.destroy({ where: { gameId: id } });
            const game = await Games.destroy({ where: { id } });

            return res.json({
                ...platforms,
                ...tags,
                ...game
            })
        }
        catch (e: any) {
            return next(APIError.badRequest(e.message));
        }
    }
}

export default (new GamesController());