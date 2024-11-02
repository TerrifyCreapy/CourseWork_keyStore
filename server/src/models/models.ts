import {DataTypes} from "sequelize";
const sequelize = require("../db");

const User = sequelize.define('user', {
    email: {type: DataTypes.STRING, unique: true, primaryKey: true},
    password: { type: DataTypes.STRING, allowNull: false},
    isConfirmed: { type: DataTypes.BOOLEAN, defaultValue: false},
    activetionLink: { type: DataTypes.STRING },
    roles: { type: DataTypes.ARRAY(DataTypes.STRING) , defaultValue: ["USER"]}
});

const Token = sequelize.define('token', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    refreshToken: {type: DataTypes.STRING(1200), allowNull: false},
});

const Buying = sequelize.define( 'buying', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    summary: { type: DataTypes.INTEGER, defaultValue: 0 },
    status: {type: DataTypes.STRING, defaultValue:"Opened"},
    payLink: {type: DataTypes.STRING(500), defaultValue: null}
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
    value: { type: DataTypes.STRING, allowNull: false }
});

const GamesPlatforms = sequelize.define( 'gamesplatforms', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
});

const TagsGames = sequelize.define( 'tagsgames', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
});

const GamesPlatformsBuyings = sequelize.define('gamesplatsbuys', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    count: {type: DataTypes.INTEGER, defaultValue: 1}
})



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
Buying.belongsToMany(Games, {through: GamesPlatformsBuyings});
Games.belongsToMany(Buying, {through: GamesPlatformsBuyings});

//Покупки платформы
Buying.belongsToMany(Platforms, {through: GamesPlatformsBuyings});
Platforms.belongsToMany(Buying, {through: GamesPlatformsBuyings});


//Ключи платформы
Platforms.hasMany(Keys);
Keys.belongsTo(Platforms);

//Ключи игры
Games.hasMany(Keys);
Keys.belongsTo(Games);

//Платформы игры
Platforms.belongsToMany(Games, {through: GamesPlatforms});
Games.belongsToMany(Platforms, {through: GamesPlatforms});

//Отзывы игры
Games.hasMany(FeedBack);
FeedBack.belongsTo(Games);

//Отзывы пользователи
User.hasMany(FeedBack);
FeedBack.belongsTo(User);

//Игры теги
Games.belongsToMany(Tags, {through: TagsGames});
Tags.belongsToMany(Games, {through: TagsGames});



module.exports = {User, Token, Buying, Keys, Platforms, Games, Tags, FeedBack, TagsGames, GamesPlatforms, GamesPlatformsBuyings};



