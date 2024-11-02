import {NextFunction, Request, Response} from "express";
import APIError from "../errors/ApiError";
import feedbackService from "../service/feedback-service";
const {FeedBack} = require("../models/models");

class FeedBackController {
    async addComments(req: Request, res: Response, next: NextFunction) {
        try {
            const {email, value, gameID} = req.body;
            const comment = await feedbackService.addComment(email, value, gameID);
            return res.status(201).json(comment);
        }
        catch(e) {
            return next(e)
        }

    }
    async getComments(req: Request, res: Response, next: Function) {
        try {
            const {id} = req.params;
            const comments = await feedbackService.getComments(+id);
            return res.json(comments);
        }
        catch(e) {
            return next(e);
        }
    }
    async removeComment(req: Request, res: Response, next: Function) {
        try {
            const id: number = +req.params.id;
            const comment = await feedbackService.removeComment(id);
            return res.json(comment);
        }
        catch(e) {
            return next(e);
        }
    }
    async editComment(req: Request, res: Response, next: Function) {
        try {
            const id: number = +req.params.id;
            const value: string = req.body;
            const comment = await feedbackService.editComment(id, value);
            return res.json(comment);
        }
        catch(e) {
            return next(e);
        }
    }
}

export default (new FeedBackController());