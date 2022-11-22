import {NextFunction, Request, Response} from "express";
import APIError from "../errors/ApiError";
const {Tags, TagsGames} = require("../models/models");

class TagsController {
    async getTags(req: Request, res: Response, next: NextFunction) {
        const tags = await Tags.findAndCountAll();
        return res.json(tags);
    }

    async addTags(req: Request, res: Response, next: NextFunction) {
        try {
            const {name} = req.body;
            if(!{name}) return next(APIError.badRequest("Need a name of tag!"));
            const tag = await Tags.create({name});
            return res.json(tag);
        }
        catch(e: any) {
            return next(APIError.badRequest(e.message));
        }

    }

    async editTag(req: Request, res: Response, next: NextFunction) {
        try {
            const {id, name} = req.body;
            if(!id || !name) return next(APIError.badRequest("Error with id or name"));
            const tag = await Tags.findByPk(id);
            if(!tag) return next(APIError.notFound("Error"));
            tag.name = name;
            await tag.save;
            return res.json(tag);
        }
        catch(e: any) {
            return next(APIError.badRequest(e.message));
        }

    }

    async removeTag(req: Request, res: Response, next: NextFunction) {
        try {
            console.log(req.params, 123);
            const {id} = req.params;
            if(!id) return next(APIError.badRequest("Error with id"));
            console.log("remove");
            const tag = await Tags.destroy({where: {id}});
            const tagsGames = await TagsGames.destroy({where: {tagId: id}});
            return res.json({
                ...tag,
                ...tagsGames
            });
        }
        catch(e: any) {
            return next(APIError.badRequest(e.message));
        }

    }
}

export default (new TagsController());