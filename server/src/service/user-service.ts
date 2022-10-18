import APIError from "../errors/ApiError";
import bcrypt from "bcrypt";
import mailService from "./mail-service";
import ApiError from "../errors/ApiError";
import TokenService from "./token-service";
import {JwtPayload} from "jsonwebtoken";
const uuid = require("uuid");
const {User, Basket, Buying} = require("../models/models");

interface IUserJwtData {
    email: string,
    id: number,
    isActivated: boolean,
    roles: string[],
}

class UserService {
    async registration(email: string, password: string) {
        const candidate = await User.findOne({where: {email}});
        if(candidate) {
            return APIError.badRequest("User with current email already exist!");
        }
        const hashPass= await bcrypt.hash(password, 5);
        const activationLink: string = uuid.v4();
        const user = await User.create({email, password: hashPass, roles: ["USER"], activetionLink:activationLink});
        const basket = await Basket.create({userId: user.id});
        await mailService.sendActivation(email, `${process.env.API_URL}/api/user/activate/${activationLink}`);

        const userJwt: IUserJwtData = {
            email: user.dataValues.email,
            id: user.dataValues.id,
            isActivated: user.dataValues.isConfirmed,
            roles: user.dataValues.roles
        };
        const tokens = TokenService.generateTokens({...userJwt});
        await TokenService.registerToken(userJwt.id, tokens.refresh);

        return {
            ...tokens,
            user: userJwt
        }
    }

    async login(email: string, password: string) {
        const user = await User.findOne({where: {email}});
        if(!user) throw ApiError.badRequest(`User with ${email} not found`);
        const isPassEquals = await bcrypt.compare(password, user.password);
        if(!isPassEquals) throw ApiError.badRequest("Password is not correct");
        const userJwt: IUserJwtData = {
            email: user.email,
            id: user.id,
            isActivated: user.isConfirmed,
            roles: user.roles
        };
        const tokens = TokenService.generateTokens({...userJwt});
        await TokenService.registerToken(userJwt.id, tokens.refresh);

        return {
            ...tokens,
            user: userJwt
        }
    }

    async logout(refresh: string) {
        const token = await TokenService.removeToken(refresh);
        return token;
    }

    async refresh(refresh: string) {
        if(!refresh) throw ApiError.notAutorized();
        const userData = TokenService.validateRefreshToken(refresh);
        const tokenDB = await TokenService.findToken(refresh);
        if(!userData || !tokenDB) {
            throw ApiError.notAutorized();
        }
        const nowUser = await User.findByPk((userData as JwtPayload).id);
        const userJwt: IUserJwtData = {
            email: nowUser.email,
            id: nowUser.id,
            isActivated: nowUser.isConfirmed,
            roles: nowUser.roles
        };
        const tokens = TokenService.generateTokens({...userJwt});
        await TokenService.registerToken(userJwt.id, tokens.refresh);

        return {
            ...tokens,
            user: userJwt
        }
    }
    
    async activate(link: string) {
        try {
            const findLink = await User.findOne({where: {activetionLink: link}});
            if(!findLink) return APIError.badRequest("Incorrect activation link");
            findLink.isConfirmed = true;
            await findLink.save();
        }
        catch (e:any) {
            return APIError.badRequest("Error");
        }
    }

    async getUsers() {
        const users = await User.findAll();
        return users;
    }

    async removeUser(id: number) {
        const tokenRemoving = await TokenService.removeUserToken(id);
        const basketRemoving = await Basket.destroy({where: {userId: id}});
        const buyingsRemoving = await Buying.destroy({where:{userId: id}});
        const userRemoving = await User.destroy({where: {id}});
        return {
            ...tokenRemoving,
            ...basketRemoving,
            ...buyingsRemoving,
            ...userRemoving,
        }
    }

}

export default new UserService();