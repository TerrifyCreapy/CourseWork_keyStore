import { Console } from "console";
import {NextFunction, Request, Response} from "express";
import jwt, {JwtPayload} from "jsonwebtoken";
import ApiError from "../errors/ApiError";

export interface IGetUserAuthInfoRequest extends Request {
    user: JwtPayload;
    currentUser: boolean | undefined;
}


export const isRoles: any = (roles: string[]) => {
    return function (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) {
        if(req.method === "OPTIONS") {
            next();
        }
        if(req.currentUser === true) return next();
        try {
            const userRoles: string[] = req.user.roles;
            roles.forEach((e) => {
                console.log(e);
                if(userRoles.indexOf(e) === -1) {
                    return next(ApiError.forbidden("Access denied"));
                }
            })
            console.log("next");
            next();
        }catch(e:any) {
            return next(ApiError.forbidden("Access denied"));
        }
    }
}
