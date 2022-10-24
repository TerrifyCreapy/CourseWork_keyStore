import {Request, Response} from "express";
import APIError from "../errors/ApiError";
const uuid = require("uuid");
const path = require("path");
const {Games, GamesPlatforms, TagsGames, Keys, FeedBack} = require("../models/models");
const fs = require("fs");

interface MulterRequest extends Request {
    files: any;
}


class GamesController {
    async getGames(req: Request, res: Response, next: Function) {
        try {
            const {tagid, platformid} = req.query;

            if(tagid && platformid) {

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
                for(let i = 0; i < gamesIdSTags.length; i++) {
                    if(gamesIdSPlatforms.indexOf(gamesIdSTags[i])>-1) {
                        gamesArray.push(gamesIdSTags[i]);
                    }
                }


                let games = await Games.findAndCountAll({
                    where: {
                        id: Array.from(gamesArray)
                    }
                });

                return res.json(games);
            }
            if(tagid && !platformid) {
                let gamesIdS: any;
                gamesIdS = await TagsGames.findAll({
                    attributes: ["gameId"],
                    where: {
                        tagId: tagid
                    }
                });
                gamesIdS = gamesIdS.map((e: any) => e.dataValues.gameId);
                gamesIdS = new Set(gamesIdS);


                let games = await Games.findAndCountAll({
                    where: {
                        id: Array.from(gamesIdS)
                    }
                });

                return res.json(games);
            }
            if(!tagid && platformid) {
                let gamesIdSPlatform: any;
                gamesIdSPlatform = await GamesPlatforms.findAll({
                    attributes: ["gameId"],
                    where: {
                        platformId: platformid
                    }
                });
                gamesIdSPlatform = gamesIdSPlatform.map((e: any) => e.dataValues.gameId);
                gamesIdSPlatform = new Set(gamesIdSPlatform);


                let games = await Games.findAndCountAll({
                    where: {
                        id: Array.from(gamesIdSPlatform)
                    }
                });

                return res.json(games);
            }

            const games = await Games.findAndCountAll();
            return res.json(games);
        }
        catch(e: any) {
            return next(APIError.badRequest(e.message))
        }
    }

    async addGames(req: Request, res: Response, next: Function) {
        try {
            const {name, price, platformsID, TagsID, description, discount, dateRealize} = req.body;
            const {img} = (req as MulterRequest).files;
            let fileName = uuid.v4() + ".jpg";
            img.mv(path.resolve(__dirname, '..', '..', 'static', fileName));

            const game = await Games.create({name, description, img: fileName, price, discount, dateAdd: (new Date()), dateRealize });

            let platformsIDjson = JSON.parse(platformsID);
            let TagsIDjson = JSON.parse(TagsID);

            for(let i = 0; i < platformsIDjson.length; i++) {
                await GamesPlatforms.create({gameId: game.id, platformId: platformsIDjson[i]});
            }
            for(let i = 0; i < TagsIDjson.length; i++) {
                await TagsGames.create({gameId: game.id, tagId: TagsIDjson[i]});
            }

            return res.status(201).json(game);
        }
        catch(e: any) {
            next(APIError.badRequest(e.message));
        }


    }

    async getGame(req: Request, res: Response, next: Function) {
        try {
            const id: number = +(req.params.id || -1);
            if(id === -1) return next(APIError.badRequest("Input id incorrect!"));
            const game = await Games.findByPk(id);
            if(!game) return res.sendStatus(404);
            return res.json(game);
        }
        catch(e: any) {
            return next(APIError.badRequest(e.message));
        }

    }
    async editGame(req: Request, res: Response, next: Function) {
        try {
            const id: number = +(req.params.id || -1);
            if(id === -1) return next(APIError.badRequest("Id error!"));
            let game = (await Games.findByPk(id)).dataValues;
            const {name, price, description, discount, dateRealize, dateAdd} = req.body;
            const {img} = (req as MulterRequest).files;
            let fileName;
            if(img) {
                fileName= uuid.v4() + ".jpg";
                img.mv(path.resolve(__dirname, '..', '..', 'static', fileName));
                try {
                    fs.unlinkSync(path.resolve(__dirname, '..', '..', 'static', game.img));
                }
                catch(e: any) {
                    console.error(e.message);
                }
            }
            game = await Games.update(
                {
                    name,
                    description,
                    img: img? fileName: game.img,
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
        catch(e: any) {
            return next(APIError.badRequest(e.message));
        }
    }

    async editTags(req: Request, res: Response, next: Function) {
        try {
            const id:number = +(req.params.id||-1);
            const tagId: number = req.body.tagid;
            if(id === -1 || !tagId) return next(APIError.badRequest("Invalid id of game or tag!"));

            const tag = await TagsGames.findAll({where: {gameId: id, tagId}});

            if(tag.length) {
                await TagsGames.destroy({
                    where: {
                        gameId: id,
                        tagId
                    }
                });
                return res.status(200).send("Removed!");
            }
            else {
                await TagsGames.create({gameId: id, tagId});
                return res.status(201).send("Added!");
            }
        }
        catch (e: any) {
            return next(APIError.badRequest(e.message));
        }
    }

    async editPlatforms(req: Request, res: Response, next: Function) {
        try{
            const id:number = +(req.params.id||-1);
            const platformId: number = req.body.platformid;
            if(id === -1 || !platformId) return next(APIError.badRequest("Invalid id of game or platform!"));

            const platform = await GamesPlatforms.findAll({where: {gameId: id, platformId}});

            if(platform.length) {
                await GamesPlatforms.destroy({
                    where: {
                        gameId: id,
                        platformId
                    }
                });
                return res.status(200).send("Removed!");
            }
            else {
                await GamesPlatforms.create({gameId: id, platformId});
                return res.status(201).send("Added!");
            }
        }
        catch (e: any) {
            return next(APIError.badRequest(e.message));
        }
    }
}

export default (new GamesController());