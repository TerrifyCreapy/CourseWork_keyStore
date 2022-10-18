import {DataTypes} from "sequelize";
import {platform} from "os";
const sequelize = require("../db");

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: {type: DataTypes.STRING, unique: true},
    password: { type: DataTypes.STRING, allowNull: false},
    isConfirmed: { type: DataTypes.BOOLEAN, defaultValue: false},
    activetionLink: { type: DataTypes.STRING },
    roles: { type: DataTypes.ARRAY(DataTypes.STRING) , defaultValue: ["USER"]}
});

const Token = sequelize.define('token', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    refreshToken: {type: DataTypes.STRING(1200), allowNull: false},
});

const Basket = sequelize.define('basket', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const BasketGame = sequelize.define('basketgame', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

const Buying = sequelize.define( 'buying', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    summary: { type: DataTypes.INTEGER },
    date: {type: DataTypes.DATE}
});

const Keys = sequelize.define( 'keys', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    value: { type: DataTypes.STRING, allowNull: false }
});

const Platforms = sequelize.define( 'platforms', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false }
});


const Games = sequelize.define( 'games', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING },
    img: {type: DataTypes.STRING, allowNull: false},
    price: { type: DataTypes.INTEGER, allowNull: false },
    discount: { type: DataTypes.INTEGER, defaultValue: 0 },
    dateAdd: { type: DataTypes.DATE },
    dateRealize: { type: DataTypes.STRING },
});

const Tags = sequelize.define( 'tags', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
});

const FeedBack = sequelize.define( 'feedback', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    value: { type: DataTypes.STRING, allowNull: false }
});

const GamesPlatforms = sequelize.define( 'gamesplatforms', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
});

const TagsGames = sequelize.define( 'tagsgames', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
});


//Пользователь - Корзина  один к одному
User.hasOne(Basket);
Basket.belongsTo(User);

//Пользователь - токен один к одному
User.hasOne(Token);
Token.belongsTo(User);

//Корзина - игры многие ко многим
Basket.belongsToMany(Games, {through: BasketGame});
Games.belongsToMany(Basket, {through: BasketGame});

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
Games.belongsToMany(Platforms, {through:GamesPlatforms});
Platforms.belongsToMany(Games, {through:GamesPlatforms});
//Ключи - игры многие к одному
Games.hasMany(Keys);
Keys.belongsTo(Games);

//Игры - теги многие ко многим
Games.belongsToMany(Tags, {through: TagsGames});
Tags.belongsToMany(Games, {through: TagsGames});

//Игры - отзывы один ко многим
Games.hasMany(FeedBack);
FeedBack.belongsTo(Games);


module.exports = {User, Token, Basket, Buying, Keys, Platforms, Games, Tags, FeedBack, TagsGames, GamesPlatforms};



