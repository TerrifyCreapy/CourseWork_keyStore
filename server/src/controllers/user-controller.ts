import {NextFunction, Request, Response} from "express";
import APIError from "../errors/ApiError";
import {IGetUserAuthInfoRequest} from "../middleware/authMiddleWare";
import UserService from "../service/user-service";
import {validationResult} from "express-validator";
import mailService from "../service/mail-service";


class UserController {

    async registration (req: Request, res: Response, next: NextFunction) {
        try {
            //validation middleware
            const errors = validationResult(req);
            if(!errors.isEmpty()) return next(APIError.badRequest("Error validating", errors.array() as []));
            //taking info from registration body
            const {email, password} = req.body;
            const user: any = await UserService.registration(email,password);
            //refreshToken and returning user
            res.cookie('refreshToken', user.refresh, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(user);
        }
        catch(e) {
            return next(e);
        }
    }
    async login (req: Request, res: Response, next: NextFunction) {
        try {
            //taking info from login body
            const {email, password} = req.body;
            const user:any = await UserService.login(email,password);
            //if true returning refresh token and user
            res.cookie('refreshToken', user.refresh, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(user);
        }
        catch (e:any) {
            return next(e);
        }


    }
    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            //taking refresh token
            const {refreshToken} = req.cookies;
            //removing tokens and clearing cookies
            const token = await UserService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        }
        catch (e) {
            return next(e);
        }

    }

    async editUser (req: Request, res: Response, next: NextFunction) {
        try {
            const {email, lastEmail} = req.body;
            const user = await UserService.editProfile(email, lastEmail);
            res.cookie('refreshToken', user.refresh, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(user);
        }
        catch (e) {
            return next(e);
        }
    }

    async editPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const {email} = req.params;
            const {last, New} = req.body;
            const status = await UserService.editPassword(email, last, New);
            res.sendStatus(200);
        }
        catch(e) {
            return next(e);
        }
    }

    async editRoles(req: Request, res: Response, next: NextFunction) {
        try {
            let {roles} = req.body;

            const {email} = req.params;
            const newUser = UserService.editUserRoles(email, roles);

            return res.json(newUser);

        }
        catch(e) {
            return next(e);
        }
    }

    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const {refreshToken} = req.cookies;
            const user:any = await UserService.refresh(refreshToken);
            res.cookie('refreshToken', user.refresh, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(user);
        }
        catch (e:any) {
            return next(e);
        }
    }

    async sendMessage(req: Request, res: Response, next: NextFunction) {
        try {
            const {email} = req.body;
            const sending = await UserService.sendMessage(email);
            return res.sendStatus(200);
        }
        catch(e) {
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

    async getUser(req: Request, res: Response, next: NextFunction) {
        try{
            const {email} = req.params;
            const user = await UserService.getUser(email);
            return res.json(user);
        }
        catch(e) {
            return next(e);
        }
    }

    async removeUser(req: Request, res: Response, next: NextFunction) {
        try {
            const email: string = req.params.email;
            const rm = await UserService.removeUser(email);
            return res.json(rm);
        }
        catch(e) {
            return next(e);
        }
    }
}

export default (new UserController());