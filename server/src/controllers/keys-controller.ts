import {Request, Response} from "express";
import APIError from "../errors/ApiError";
const {Keys} = require("../models/models");

class KeysController {
    async addKeys(req: Request, res: Response, next: Function) {
        try{
            const {value, platformId, gameId} = req.body;
            if(!value || !platformId || !gameId) next(APIError.badRequest("Error with key!"));
            const newKey = await Keys.create({value, platformId, gameId});
            return res.status(201).json(newKey);
        }
        catch(e: any) {
            return next(APIError.badRequest(e.message));
        }
    }

    async getKey(req: Request, res: Response, next: Function) {
        try{
            const id:number = +(req.params.id|| -1);
            if(id === -1) return next(APIError.notFound("Not found"));
            const key = Keys.findByPk(id);
            return res.json(key);
        }
        catch(e: any) {
            return next(APIError.badRequest(e.message));
        }
    }

    async removeKey(req: Request, res: Response, next: Function) {
        try{
            const id:number = +(req.params.id|| -1);
            if(id === -1) return next(APIError.notFound("Not found"));
            const key = Keys.destroy({
                where: {
                    id
                }
            });
            return res.json(key);
        }
        catch(e: any) {
            return next(APIError.badRequest(e.message));
        }
    }
    async editKey(req: Request, res: Response, next: Function) {
        try{
            const id:number = +(req.params.id|| -1);
            if(id === -1) return next(APIError.notFound("Not found"));
            const {value, platformId, gameId} = req.body;
            if(!value || !platformId || !gameId) next(APIError.badRequest("Error with key!"));
            const key = await Keys.update({
                value,
                platformId,
                gameId
            }, {
                where: {
                    id
                }
            });

            return res.json(key);
        }
        catch(e: any) {
            return next(APIError.badRequest(e.message));
        }
    }
}

export default (new KeysController());