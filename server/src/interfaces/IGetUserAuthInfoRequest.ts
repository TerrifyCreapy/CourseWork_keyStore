import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export default interface IGetUserAuth extends Request {
    user: JwtPayload;
    currentUser: boolean|undefined
}