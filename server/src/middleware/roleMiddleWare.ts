import {NextFunction, Request, Response} from "express";
import jwt, {JwtPayload} from "jsonwebtoken";
import ApiError from "../errors/ApiError";

export interface IGetUserAuthInfoRequest extends Request {
    user: JwtPayload;
}


export default function (roles: string[]) {
    return function (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) {
        if(req.method === "OPTIONS") {
            next();
        }
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if(!token) {
                return next(ApiError.notAutorized());
            }
            const userRoles: string[] = req.user.roles;
            roles.forEach((e) => {
                if(userRoles.indexOf(e) === -1) {
                    return next(ApiError.forbidden("Access denied"));
                }
            })
            next();
        }catch(e:any) {
            return next(ApiError.forbidden("Access denied"));
        }
    }
}
