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
        const user = await User.create({email, password: hashPass, roles: ["USER", "MODER", "ADMIN"], activetionLink:activationLink});
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
        console.log(user);
        if(!user) throw ApiError.badRequest(`User with ${email} not found`);
        const isPassEquals = await bcrypt.compare(password, user.password);
        console.log(isPassEquals);
        if(!isPassEquals) throw ApiError.badRequest("Password is not correct");
        const userJwt: IUserJwtData = {
            email: user.email,
            isActivated: user.isConfirmed,
            roles: user.roles
        };
        console.log(userJwt);
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
        const nowUser = await User.findByPk((userData as JwtPayload).email);

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

    async sendMessage(email: string) {
        if(!email) throw ApiError.badRequest("Error with email of user");
        const user = await User.findByPk(email);
        if(!user) throw ApiError.notFound("Not found user");
        console.log(user);
        await mailService.sendActivation(email, `${process.env.API_URL}/api/user/activate/${user.activetionLink}`);
    
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
        const buyingRemove = await Buying.update({userEmail: null}, {where: {userEmail}});
        const buyingRemoving = await Buying.destroy({where: {userEmail}});
        const userRemoving = await User.destroy({where: {email: userEmail}});
        return {
            ...tokenRemoving,
            ...feedbackRemoving,
            ...userRemoving,
            ...buyingRemove,
            ...buyingRemoving
        }
    }

    async editProfile(email: string, lastEmail: string) {
        if(!email || !lastEmail) throw APIError.badRequest("Error email");
        if(email === lastEmail) throw ApiError.badRequest("New and last email are similar");
        const userData = await User.findByPk(lastEmail);
        if(!userData) throw APIError.badRequest("Incorrect email");

        const exist = await isExist(email);
        if(exist.exist) throw ApiError.badRequest("User already exists");
        const user = await User.update({
            email: email,
            isConfirmed: false,
            activetionLink:uuid.v4()
        }, {where: {email: lastEmail}});
        const newUser = await User.findByPk(email);
        const userJwt: IUserJwtData = {
            email: newUser.email,
            isActivated: newUser.isConfirmed,
            roles: newUser.roles
        };
        console.log(userJwt)
        const tokens = TokenService.generateTokens({...userJwt});
        await TokenService.registerToken(userJwt.email, tokens.refresh);
        return {
            ...tokens,
            user: userJwt
        };
    }

    async editPassword(email: string,lastPassword: string, newPassword: string) {
        if(!lastPassword || !newPassword) throw ApiError.badRequest("Error with new or last password");
        if(!email) throw ApiError.badRequest("Error with email of user");
        const user = await User.findByPk(email);
        if(!user) throw ApiError.notFound("User not found");
        const comparePass = await bcrypt.compare(lastPassword, user.password);
        if(!comparePass) throw APIError.forbidden("Not correct password");
        const newPasswordHash = await bcrypt.hash(newPassword, 5);
        user.password = newPasswordHash;
        await user.save();
        return true;
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

    async getUser(email: string) {
        if(!email) throw APIError.badRequest("No email");
        const user = await User.findOne({attributes: ["email", "isConfirmed", "roles", "createdAt"], where: {email}});
        return user;
    }

}

export default new UserService();