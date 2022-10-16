import {Request, Response} from "express";
import APIError from "../errors/ApiError";
const {FeedBack} = require("../models/models");

class FeedBackController {
    async addComments(req: Request, res: Response, next: Function) {
        const {name, value, gameID} = req.body;
        if(!name || !value) return next(APIError.badRequest("Body of comment is empty!"));
        const comment = await FeedBack.create({name, value});
        return res.json(comment);
    }
    async getComments(req: Request, res: Response) {

    }
    async removeComment(req: Request, res: Response) {

    }
}

export default (new FeedBackController());