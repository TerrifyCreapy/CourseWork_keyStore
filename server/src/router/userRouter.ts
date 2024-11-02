import express from "express";
import UserController from "../controllers/user-controller";
import userController from "../controllers/user-controller";
import {isAuth} from "../middleware/authMiddleWare";
import {body} from "express-validator";
import {isRoles} from "../middleware/roleMiddleWare";
import {currentUser} from "../middleware/currentUserMiddleWare";
const router = express.Router();

router.get('/users', isAuth, isRoles(["MODER" ,"ADMIN"]),UserController.getUsers); //Получение списка пользователей(Только роль модератора и администратора)
router.get('/getuser/:email', UserController.getUser);
router.post(
    '/registration',
    body("email").isEmail(),
    body("password").isLength({min:5, max:32}),
    UserController.registration); //Регистрация и валидиция пользователя
router.post('/login', userController.login);//Авторизация
router.post("/logout", userController.logout);//Выход
router.post('/edit/:email', isAuth, currentUser, isRoles(["MODER", "ADMIN"]), UserController.editUser);//Изменить данные пользователя
router.post('/edit/pass/:email', isAuth, currentUser, isRoles(["MODER", "ADMIN"]), UserController.editPassword);//Изменить данные пользователя
router.post('/roles/:email', isAuth, isRoles(["ADMIN"]), UserController.editRoles);
router.get("/refresh", UserController.refresh);//Обновить refresh токен пользователя
router.post("/send", isAuth, currentUser, UserController.sendMessage)
router.get("/activate/:link", UserController.activateAccount);//Активировать аккаунт
router.delete("/remove/:email", isAuth, currentUser,isRoles(["ADMIN"]), UserController.removeUser);//Удалить пользователя



export default router;