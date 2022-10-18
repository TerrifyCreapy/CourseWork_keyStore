"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = require("../db");
const User = sequelize.define('user', {
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: sequelize_1.DataTypes.STRING, unique: true },
    password: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    isConfirmed: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: false },
    activetionLink: { type: sequelize_1.DataTypes.STRING },
    roles: { type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING), defaultValue: ["USER"] }
});
const Token = sequelize.define('token', {
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    refreshToken: { type: sequelize_1.DataTypes.STRING(1200), allowNull: false },
});
const Basket = sequelize.define('basket', {
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});
const BasketGame = sequelize.define('basketgame', {
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});
const Buying = sequelize.define('buying', {
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    summary: { type: sequelize_1.DataTypes.INTEGER },
    date: { type: sequelize_1.DataTypes.DATE }
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
    name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    value: { type: sequelize_1.DataTypes.STRING, allowNull: false }
});
const GamesPlatforms = sequelize.define('gamesplatforms', {
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});
const TagsGames = sequelize.define('tagsgames', {
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});
//Пользователь - Корзина  один к одному
User.hasOne(Basket);
Basket.belongsTo(User);
//Пользователь - токен один к одному
User.hasOne(Token);
Token.belongsTo(User);
//Корзина - игры многие ко многим
Basket.belongsToMany(Games, { through: BasketGame });
Games.belongsToMany(Basket, { through: BasketGame });
//Пользователь - Покупка один ко многим
User.hasMany(Buying);
Buying.belongsTo(User);
//Покупка - Ключ один ко многим
Keys.hasOne(Buying);
Buying.belongsTo(Keys);
//Платформы - ключ один ко многим
Platforms.hasMany(Keys);
Keys.belongsTo(Platforms);
//Игры - Платформы многие ко многим
Games.belongsToMany(Platforms, { through: GamesPlatforms });
Platforms.belongsToMany(Games, { through: GamesPlatforms });
//Ключи - игры многие к одному
Games.hasMany(Keys);
Keys.belongsTo(Games);
//Игры - теги многие ко многим
Games.belongsToMany(Tags, { through: TagsGames });
Tags.belongsToMany(Games, { through: TagsGames });
//Игры - отзывы один ко многим
Games.hasMany(FeedBack);
FeedBack.belongsTo(Games);
module.exports = { User, Token, Basket, Buying, Keys, Platforms, Games, Tags, FeedBack, TagsGames, GamesPlatforms };
