import APIError from "../errors/ApiError";
import bcrypt from "bcrypt";
import mailService from "./mail-service";
import ApiError from "../errors/ApiError";
import TokenService from "./token-service";
import {JwtPayload} from "jsonwebtoken";
const uuid = require("uuid");
const {User, Buying, FeedBack} = require("../models/models");

interface IUserJwtData {
    email: string,
    isActivated: boolean,
    roles: string[],
}



async function isExist(email: string) {
    const user = await User.findByPk(email);
    if(user) return {exist:true};
    return {exits: false};
}


class UserService {
    async registration(email: string, password: string) {
        const candidate = await isExist(email);
        if(candidate.exist) {
            throw APIError.badRequest("User with current email already exist!");
        }
        const hashPass= await bcrypt.hash(password, 5);
        const activationLink: string = uuid.v4();
        const user = await User.create({email, password: hashPass, roles: ["USER"], activetionLink:activationLink});
        const userBuy = await Buying.create({userEmail: email});
        await mailService.sendActivation(email, `${process.env.API_URL}/api/user/activate/${activationLink}`);

        const userJwt: IUserJwtData = {
            email: user.email,
            isActivated: user.isConfirmed,
            roles: user.roles
        };
        const tokens = TokenService.generateTokens({...userJwt});
        await TokenService.registerToken(userJwt.email, tokens.refresh);

        return {
            ...tokens,
            ...userBuy,
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
            isActivated: user.isConfirmed,
            roles: user.roles
        };
        const tokens = TokenService.generateTokens({...userJwt});
        await TokenService.registerToken(userJwt.email, tokens.refresh);

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
            isActivated: nowUser.isConfirmed,
            roles: nowUser.roles
        };
        const tokens = TokenService.generateTokens({...userJwt});
        await TokenService.registerToken(userJwt.email, tokens.refresh);

        return {
            ...tokens,
            user: userJwt
        }
    }
    
    async activate(link: string) {
        try {
            const findLink = await User.findOne({where: {activetionLink: link}});
            if(!findLink) throw APIError.badRequest("Incorrect activation link");
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

    async removeUser(userEmail: string) {
        const tokenRemoving = await TokenService.removeUserToken(userEmail);
        const feedbackRemoving = await FeedBack.destroy({where: {userEmail}});
        const userRemoving = await User.destroy({where: {email: userEmail}});
        return {
            ...tokenRemoving,
            ...feedbackRemoving,
            ...userRemoving,
        }
    }

    async editProfile(email: string, password: string, lastEmail: string) {
        if(!email && !password) throw APIError.badRequest("Error email or password");
        const userData = await User.findByPk(lastEmail);
        console.log(!password.length);
        if(!userData) throw APIError.badRequest("Incorrect email");
        if(password.length) {
            const comparePass = await bcrypt.compare(password, userData.password);
            if(!comparePass) throw APIError.badRequest("Incorrect password");
        }


        let user: any = null;

        if(email && !password.length) {
            const exist = await isExist(email);
            if(exist.exist) throw APIError.badRequest("User already exists");
            user = await User.update(
                {email, isConfirmed: false},
                {where: {email: userData.email}},
            );
        }
        else if(!email && password.length) {
            const newPass = bcrypt.hash(password, 5);
            user = await User.update(
                {password: newPass},
                {where: {email: userData.email}}
            );
        }
        else if(email && password.length) {
            const exist = await isExist(email);
            if(exist.exist) throw APIError.badRequest("User already exists");
            const newPass = bcrypt.hash(password, 5);
            user = await User.update(
                {email, password: newPass, isConfirmed: false},
                {where: {email}}
            );
        }
        return user;
    }

    async editUserRoles(email: string ,roles: string[]) {

        if(!email || !roles.length) throw APIError.badRequest("Error email or roles");

        const userRoles = await User.update(
            {roles: roles},
            {where: {
                email
            }}
        );

        const tokenUpdate = await TokenService.removeUserToken(email);

        return {
            ...userRoles,
            ...tokenUpdate
        };
    }

}

export default new UserService();