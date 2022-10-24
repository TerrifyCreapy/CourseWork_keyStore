import {NextFunction, Request, Response} from "express";
import {JwtPayload} from "jsonwebtoken";
import APIError from "../errors/ApiError";
import TokenService from "../service/token-service";

export interface IGetUserAuthInfoRequest extends Request {
    user: JwtPayload;
    currentUser: boolean|undefined
}

export const currentUser: any = (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
        if (req.method === "OPTIONS") {
            next();
        }
        try {
            if(req.params.email === req.user.email) {
                req.currentUser = true;
            }
            else {
                req.currentUser = false;
            }
            next();
        } catch (e: any) {
            return next(APIError.notAutorized());
        }
    }