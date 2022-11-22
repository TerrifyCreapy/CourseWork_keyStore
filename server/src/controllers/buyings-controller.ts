import {NextFunction, Request, Response} from "express";
import APIError from "../errors/ApiError";
import BuyingsService from "../service/buyings-service";
import IGetUserAuth from "../interfaces/IGetUserAuthInfoRequest";
import keysService from "../service/keys-service";
const {Buying, GamesPlatformsBuyings, Games, Platforms} = require("../models/models");

class BuyingController {

    async getBasket(req: IGetUserAuth, res: Response, next: NextFunction) {
        try {
                const {email} = req.user;
                const basket = await BuyingsService.getBasket(email);
                return res.json(basket[0]);
        }
        catch(e) {
            return next(e);
        }
    }

    async getHistory(req: IGetUserAuth, res: Response, next: NextFunction) {
        try {
            const {email} = req.user;
            const history = await BuyingsService.getHistory(email);
            return res.json(history);
        }
        catch(e) {
            return next(e);
        }
    }

    async getAllGamesBougth(req: IGetUserAuth, res: Response, next: NextFunction) {
        try {
            const {email} = req.user;
            console.log(email, 123);
            const games = await BuyingsService.getBuyingGames(email);
            return res.json(games);
        }
        catch(e) {
            return next(e);
        }
    }

    async addGame(req: Request, res: Response, next: NextFunction) {
        try {
            let {email, platformId, gameId, count} = req.body;
            const game = BuyingsService.addGame(email,platformId, gameId, count==null? count : 1);
            return res.json(game);
        }
        catch(e) {
            return next(e);
        }
    }

    async removeGame(req: IGetUserAuth, res: Response, next: NextFunction) {
        try {
            let {email} = req.user;
            let {platformId, gameId} = req.body;
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
    async createPayment(req: IGetUserAuth, res: Response, next: NextFunction) { //Пока заглушка проверка оплаты
        try {
            const {email, price, games} = req.body;
            console.log(price);

            const isKeys = await keysService.checkKeys(games);
            if(!isKeys) return next(APIError.badRequest("Not enough keys!"));

            const link = await BuyingsService.createPayment(email, price, games);
            return res.json(link);
        }
        catch(e) {
            return next(e);
        }
    }


    async test(req: Request, res: Response) {
        const gamesplats = await GamesPlatformsBuyings.findAll({where: {buyingId: 2}});

        const gamesPlatforms = [];

        for(let i = 0; i < gamesplats.length; i++) {
            const tGame = await Games.findOne({attributes: ["id", "name", "img", "price", "discount"], where: {id: gamesplats[i].dataValues.gameId}});
            const tPlatform = await Platforms.findOne({attributes: ["id","name"], where: {id: gamesplats[i].dataValues.platformId}});
            gamesPlatforms.push({...tGame.dataValues, platform: tPlatform});
        }

        const platforms = await Platforms.findAll({where: {id: gamesplats.map((e: any) => e.dataValues.platformId)}});
        const games = await Games.findAll( {attributes: ["id", "name", "img", "price", "discount"],where: {id: gamesplats.map((e:any) => e.dataValues.gameId)}});
        return res.json(gamesPlatforms);
    }
}

export default (new BuyingController());