import {NextFunction, Request, Response} from "express";
import KeysService from "../service/keys-service";

class KeysController {
    async addKeys(req: Request, res: Response, next: Function) {
        try{
            const {keyValue, platformId, gameId} = req.body;
            const newKey = await KeysService.addKey(keyValue, platformId, gameId);
            return res.status(201).json(newKey);
        }
        catch(e: any) {
            return next(e);
        }
    }

    async getKey(req: Request, res: Response, next: Function) {
        try{
            const id:number = +(req.params.id|| -1);
            const {email} = req.body;
            const key = await KeysService.getKey(id, email);
            return res.json(key);
        }
        catch(e: any) {
            return next(e);
        }
    }

    async removeKey(req: Request, res: Response, next: Function) {
        try{
            const id:number = +(req.params.id|| -1);
            const key = await KeysService.removeKey(id);
            return res.json(key);
        }
        catch(e: any) {
            return next(e);
        }
    }

    async sendKeys(req: Request, res: Response, next: NextFunction) {
        try {
            const {userEmail, buyingId} = req.body;
            console.log(userEmail, buyingId);
            const keysgames = await KeysService.takeBoughtKeys(userEmail, buyingId);
            return res.sendStatus(200);
        }
        catch(e: any) {
            return next(e);
        }
    }
    

    async editKey(req: Request, res: Response, next: Function) {
        try{
            const id:number = +(req.params.id|| -1);
            const {value, platformId, gameId} = req.body;
            const body = {
                id,
                value,
                platformId: platformId === "NULL"? null : platformId,
                gameId: gameId === "NULL"? null : gameId,
            }
            await KeysService.editKey(body.id, body.value, body.platformId, body.gameId);

            return res.sendStatus(200);
        }
        catch(e: any) {
            return next(e);
        }
    }
}

export default (new KeysController());