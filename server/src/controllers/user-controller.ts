import {NextFunction, Request, Response} from "express";
import APIError from "../errors/ApiError";
import {IGetUserAuthInfoRequest} from "../middleware/authMiddleWare";
import UserService from "../service/user-service";
import {validationResult} from "express-validator";


class UserController {

    async registration (req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()) return next(APIError.badRequest("Error validating", errors.array() as []))
            const {email, password} = req.body;

            const user: any = await UserService.registration(email,password);
            res.cookie('refreshToken', user.refresh, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(user);
        }
        catch(e) {
            return next(e);
        }
    }
    async login (req: Request, res: Response, next: NextFunction) {
        try {
            const {email, password} = req.body;
            const user:any = await UserService.login(email,password);
            res.cookie('refreshToken', user.refresh, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(user);
        }
        catch (e:any) {
            return next(e);
        }


    }
    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const {refreshToken} = req.cookies;
            const token = await UserService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        }
        catch (e) {
            return next(e);
        }

    }
    async isAuth (req: IGetUserAuthInfoRequest, res: Response<{}>, next: Function) {
       /* const token = generateJwt(req.user.id, req.user.email, req.user.roles);
        return res.json({token});*/
    }
    async editUser (req: Request, res: Response) {

    }

    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const {email, password} = req.body;
            const user:any = await UserService.login(email,password);
            res.cookie('refreshToken', user.refresh, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(user);
        }
        catch (e:any) {
            return next(e);
        }
    }
    async activateAccount(req: Request, res: Response, next: NextFunction) {
        try {
            const {link} = req.params;
            const user = await UserService.activate(link);
            return res.redirect(process.env.CLIENT_URL as string);
        }
        catch(e:any) {
            return next(e);
        }
    }

    async getUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await UserService.getUsers();
            return res.json(users);
        }
        catch(e) {
            return next(e);
        }
    }

    async removeUser(req: Request, res: Response, next: NextFunction) {
        try {
            const id: number = +req.params.id;
            const rm = await UserService.removeUser(id);
            return res.json(rm);
        }
        catch(e) {
            return next(e);
        }
    }
}

export default (new UserController());