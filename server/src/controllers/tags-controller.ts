import {Request, Response} from "express";
import APIError from "../errors/ApiError";
const {Tags} = require("../models/models");

class TagsController {
    async getTags(req: Request, res: Response) {
        const tags = await Tags.findAll();
        return res.json(tags);
    }

    async addTags(req: Request, res: Response, next: Function) {
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
}

export default (new TagsController());