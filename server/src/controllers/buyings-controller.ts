import {NextFunction, Request, Response} from "express";
import APIError from "../errors/ApiError";
import BuyingsService from "../service/buyings-service";
const {Buying} = require("../models/models");

class BuyingController {
    async setStatusPaying(req: Request, res: Response, next: NextFunction) {
        try {
            const {id, email} = req.body;
            await BuyingsService.setStatusPaying(id,"Pay");
            const newBuy = BuyingsService.createNewBuing(email);

            return res.json(newBuy);
        }
        catch(e) {
            return next(e);
        }

    }

    async addGame(req: Request, res: Response, next: NextFunction) {
        try {
            let {email, platformId, gameId, count} = req.body;
            const game = BuyingsService.addGame(email,platformId, gameId, count);
            return res.json(game);
        }
        catch(e) {
            return next(e);
        }
    }

    async removeGame(req: Request, res: Response, next: NextFunction) {
        try {
            let {email, platformId, gameId} = req.body;
            const game = BuyingsService.removeGame(email,platformId, gameId);
            return res.json(game);
        }
        catch(e) {
            return next(e);
        }
    }

    async getBuyings(req: Request, res: Response, next: NextFunction) {
        try {
            const {email} = req.body;
            const buyings = await BuyingsService.getBuyings(email);
            return res.json(buyings);
        }
        catch(e) {
            return next(e);
        }
    }
//TODO pay for user
    async checkPayment(req: Request, res: Response, next: NextFunction) { //Пока заглушка проверка оплаты

    }

    async setStatusClosed(req: Request, res: Response, next: NextFunction) { //Заглушка
        try {
            const {id} = req.body;
            await BuyingsService.setStatusPaying(id,"Closed");
            return res.json(200);
        }
        catch(e) {
            return next(e);
        }
    }
}

export default (new BuyingController());