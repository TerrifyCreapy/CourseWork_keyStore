import {Request, Response} from "express";
import APIError from "../errors/ApiError";
import {IPlatform} from "../interfaces/entityInterfaces";
const {Platforms} =  require("../models/models");

class PlatformsController {
    async getPlatforms(req: Request, res: Response) {
        const platforms = await Platforms.findAll();
        return res.json(platforms);
    }

    async addPlatform(req: Request, res: Response, next: Function) {
        const {name} = req.body;
        if(!name) return next(APIError.badRequest("Insert name of platform is empty! Insert name."));
        const platform = await Platforms.create({name});
        return res.json(platform);
    }
}

export default (new PlatformsController());