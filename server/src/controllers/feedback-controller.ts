import {Request, Response} from "express";
import APIError from "../errors/ApiError";
const {FeedBack} = require("../models/models");

class FeedBackController {
    async addComments(req: Request, res: Response, next: Function) {
        const {name, value, gameID} = req.body;
        if(!name || !value) return next(APIError.badRequest("Body of comment is empty!"));
        const comment = await FeedBack.create({name, value});
        return res.status(201).json(comment);
    }
    async getComments(req: Request, res: Response, next: Function) {
        const {id} = req.body;
        if(!id) return next(APIError.badRequest("Error with id of game!"));
        const commends = await FeedBack.findAndCountAll({where: {id}});
        return res.json(commends);

    }
    async removeComment(req: Request, res: Response, next: Function) {
        try {
            const id = req.params.id;
            if(!id) return next(APIError.badRequest("Error with id of comment!"));
            const comment = await FeedBack.destroy({where: {id}});
            return res.json(comment);
        }
        catch(e: any) {
            return next(APIError.badRequest(e.message));
        }
    }
}

export default (new FeedBackController());