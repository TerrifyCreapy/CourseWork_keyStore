import {NextFunction, Request, Response} from "express";
import APIError from "../errors/ApiError";
const {Platforms} =  require("../models/models");

class PlatformsController {
    async getPlatforms(req: Request, res: Response, next: NextFunction) {
        try {
            console.log(123)
            const platforms = await Platforms.findAndCountAll();
            return res.json(platforms);
        }
        catch(e) {
            return next(e);
        }
    }

    async addPlatform(req: Request, res: Response, next: Function) {
        try {
            const {name} = req.body;
            if(!name) return next(APIError.badRequest("Inserting name of platform is empty! Insert name."));
            const platform = await Platforms.create({name});
            return res.json(platform);
        }
        catch(e) {
            return next(e);
        }
    }

    async editPlatform(req: Request, res: Response, next: Function) {
        try {
            const {id} = req.params;
            const {name} = req.body;
            if(!name || !id) return next(APIError.badRequest("Error"));
            const platform = await Platforms.findByPk(id);
            if(!platform) return next(APIError.notFound("Not found"));
            platform.name = name;
            await platform.save();
            return res.sendStatus(200);
        }
        catch(e) {
            return next(e);
        }
    }
    async removePlatform(req: Request, res: Response, next: Function) {
        try {
            const {id} = req.params;
            console.log(123, "next");
            if(!id) return next(APIError.badRequest("Error"));
            const platform = await Platforms.destroy({where: {id}});
            return res.json(platform);
        }
        catch(e) {
            return next(e);
        }
    }
}

export default (new PlatformsController());