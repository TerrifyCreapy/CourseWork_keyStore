import express from "express";
import UserController from "../controllers/user-controller";
import userController from "../controllers/user-controller";
import authMiddleWare from "../middleware/authMiddleWare";
import regValidator from "../validator/reg-validator";
import {regSchema} from "../validator/schemas/regSchema";
import {body} from "express-validator";
import roleMiddleWare from "../middleware/roleMiddleWare";
const router = express.Router();

// @ts-ignore
router.get('/auth', authMiddleWare, UserController.isAuth); //Проверка авторизации
// @ts-ignore
router.get('/users', authMiddleWare, roleMiddleWare(["MODER" ,"ADMIN"]),UserController.getUsers); //Получение списка пользователей(Только роль модератора и администратора)
router.post(
    '/registration',
    body("email").isEmail(),
    body("password").isLength({min:5, max:32}),
    UserController.registration); //Регистрация и валидиция пользователя
router.post('/login', userController.login);//Авторизация
router.post("/logout", userController.logout);//Выход
router.post('/edit/:id', UserController.editUser);//Изменить данные пользователя
router.get("/refresh", UserController.refresh);//Обновить refresh токен пользователя
router.get("/activate/:link", UserController.activateAccount);//Активировать аккаунт
router.delete("/remove/:id", UserController.removeUser);//Удалить пользователя



export default router;