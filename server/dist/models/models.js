"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = require("../db");
const User = sequelize.define('user', {
    email: { type: sequelize_1.DataTypes.STRING, unique: true, primaryKey: true },
    password: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    isConfirmed: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: false },
    activetionLink: { type: sequelize_1.DataTypes.STRING },
    roles: { type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING), defaultValue: ["USER"] }
});
const Token = sequelize.define('token', {
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    refreshToken: { type: sequelize_1.DataTypes.STRING(1200), allowNull: false },
});
const Buying = sequelize.define('buying', {
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    summary: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 0 },
    status: { type: sequelize_1.DataTypes.STRING, defaultValue: "Opened" },
    payLink: { type: sequelize_1.DataTypes.STRING(500), defaultValue: null }
});
const Keys = sequelize.define('keys', {
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    value: { type: sequelize_1.DataTypes.STRING, allowNull: false }
});
const Platforms = sequelize.define('platforms', {
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: sequelize_1.DataTypes.STRING, allowNull: false }
});
const Games = sequelize.define('games', {
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    description: { type: sequelize_1.DataTypes.STRING },
    img: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    price: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    discount: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 0 },
    dateAdd: { type: sequelize_1.DataTypes.DATE },
    dateRealize: { type: sequelize_1.DataTypes.STRING },
});
const Tags = sequelize.define('tags', {
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
});
const FeedBack = sequelize.define('feedback', {
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    value: { type: sequelize_1.DataTypes.STRING, allowNull: false }
});
const GamesPlatforms = sequelize.define('gamesplatforms', {
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});
const TagsGames = sequelize.define('tagsgames', {
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});
const GamesPlatformsBuyings = sequelize.define('gamesplatsbuys', {
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    count: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 1 }
});
//Пользователь токен
User.hasOne(Token);
Token.belongsTo(User);
//Пользователь покупки
User.hasMany(Buying);
Buying.belongsTo(User);
//Покупки ключи
Buying.hasMany(Keys);
Keys.belongsTo(Buying);
//Покупки Игры
Buying.belongsToMany(Games, { through: GamesPlatformsBuyings });
Games.belongsToMany(Buying, { through: GamesPlatformsBuyings });
//Покупки платформы
Buying.belongsToMany(Platforms, { through: GamesPlatformsBuyings });
Platforms.belongsToMany(Buying, { through: GamesPlatformsBuyings });
//Ключи платформы
Platforms.hasMany(Keys);
Keys.belongsTo(Platforms);
//Ключи игры
Games.hasMany(Keys);
Keys.belongsTo(Games);
//Платформы игры
Platforms.belongsToMany(Games, { through: GamesPlatforms });
Games.belongsToMany(Platforms, { through: GamesPlatforms });
//Отзывы игры
Games.hasMany(FeedBack);
FeedBack.belongsTo(Games);
//Отзывы пользователи
User.hasMany(FeedBack);
FeedBack.belongsTo(User);
//Игры теги
Games.belongsToMany(Tags, { through: TagsGames });
Tags.belongsToMany(Games, { through: TagsGames });
module.exports = { User, Token, Buying, Keys, Platforms, Games, Tags, FeedBack, TagsGames, GamesPlatforms, GamesPlatformsBuyings };
