import {Request, Response} from "express";
import APIError from "../errors/ApiError";

class UserController {
    async getUsers(req: Request, res: Response) {

    }
    async registration (req: Request, res: Response) {

    }
    async login (req: Request, res: Response) {

    }
    async isAuth (req: Request, res: Response<{}>, next: Function) {
        if(!req.query.id) return next(APIError.badRequest("No id!"));
        return res.json(req.query)
    }
    async editUser (req: Request, res: Response) {

    }
}

export default (new UserController());