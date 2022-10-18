import APIError from "../errors/ApiError";
import {Request, Response} from "express";

export default function (err: unknown, req: Request, res: Response<{message: string, errors?: []}>, next: unknown) {
    if(err instanceof APIError) {
        return res.status(err.status).json({message: err.message, errors: err.errors});
    }
    return res.status(500).json({message: "Infernal error!"});
}