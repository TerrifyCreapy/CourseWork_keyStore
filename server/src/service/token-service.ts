import jwt from "jsonwebtoken";
const {Token} = require("../models/models");

interface Itoken {
    token: string,
    refresh: string
}

class TokenService {
    generateTokens(payload: Object): Itoken {
        const accessToken = jwt.sign(payload, process.env.KEY_JWT as string, {expiresIn: '30m'});
        const refreshToken = jwt.sign(payload, process.env.REFRESH_JWT as string, {expiresIn: '30d'});
        return {
            token: accessToken,
            refresh: refreshToken
        }
    }

    validateAccessToken(token: string) {
        try {
            const userData = jwt.verify(token, process.env.KEY_JWT as string);
            return userData;
        }
        catch(e) {
            return null;
        }
    }
    validateRefreshToken(token: string) {
        try {
            const userData = jwt.verify(token, process.env.REFRESH_JWT as string);
            return userData;
        }
        catch(e) {
            return null;
        }
    }

    async findToken(refresh:string) {
        const token = await Token.findOne({where: {refreshToken: refresh}});
        return token;
    }

    async registerToken(userId: number, refreshToken: string) {
        const tokenData = await Token.findOne({where: {userId}});
        if(tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        const token = await Token.create({refreshToken, userId});
        return token;
    }

    async removeToken(refresh: string) {
        const tokenData = await Token.destroy({where: {
                refreshToken: refresh
        }});
        return tokenData;
    }

    async removeUserToken(id: number) {
        const token = await Token.destroy({where: {userId: id}});
        return token;
    }
}

export default new TokenService();