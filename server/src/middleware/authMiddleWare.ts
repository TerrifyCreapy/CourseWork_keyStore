import {NextFunction, Request, Response} from "express";
import {JwtPayload} from "jsonwebtoken";
import APIError from "../errors/ApiError";
import TokenService from "../service/token-service";

 export interface IGetUserAuthInfoRequest extends Request {
    user: JwtPayload;
}

export const isAuth: any = (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    if(req.method === "OPTIONS") {
        next();
    }
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if(!token) {
            return next(APIError.notAutorized());
        }
        const userData = TokenService.validateAccessToken(token);
        if(!userData) return next(APIError.notAutorized());
        req.user = userData as JwtPayload;
        console.log(req.user);
        next();
    }catch(e:any) {
        return next(APIError.notAutorized());
    }
}