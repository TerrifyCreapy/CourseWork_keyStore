"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("../controllers/user-controller"));
const user_controller_2 = __importDefault(require("../controllers/user-controller"));
const authMiddleWare_1 = __importDefault(require("../middleware/authMiddleWare"));
const express_validator_1 = require("express-validator");
const roleMiddleWare_1 = __importDefault(require("../middleware/roleMiddleWare"));
const router = express_1.default.Router();
// @ts-ignore
router.get('/auth', authMiddleWare_1.default, user_controller_1.default.isAuth); //Проверка авторизации
// @ts-ignore
router.get('/users', authMiddleWare_1.default, (0, roleMiddleWare_1.default)(["MODER", "ADMIN"]), user_controller_1.default.getUsers); //Получение списка пользователей(Только роль модератора и администратора)
router.post('/registration', (0, express_validator_1.body)("email").isEmail(), (0, express_validator_1.body)("password").isLength({ min: 5, max: 32 }), user_controller_1.default.registration); //Регистрация и валидиция пользователя
router.post('/login', user_controller_2.default.login); //Авторизация
router.post("/logout", user_controller_2.default.logout); //Выход
router.post('/edit/:id', user_controller_1.default.editUser); //Изменить данные пользователя
router.get("/refresh", user_controller_1.default.refresh); //Обновить refresh токен пользователя
router.get("/activate/:link", user_controller_1.default.activateAccount); //Активировать аккаунт
router.delete("/remove/:id", user_controller_1.default.removeUser); //Удалить пользователя
exports.default = router;
