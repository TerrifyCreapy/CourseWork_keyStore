import express from "express";
import BuyingsController from "../controllers/buyings-controller";
import {isAuth} from "../middleware/authMiddleWare";
import {isRoles} from "../middleware/roleMiddleWare";
import {currentUser} from "../middleware/currentUserMiddleWare";
const router = express.Router();

router.get('/', isAuth, currentUser,isRoles(["MODER" ,"ADMIN"]),BuyingsController.getBuyings); //Получение списка пользователей(Только роль модератора и администратора)
router.post('/pay/:id', isAuth, currentUser, BuyingsController.setStatusPaying);
router.post('/game', isAuth, currentUser, BuyingsController.addGame);
router.delete('/game', isAuth, currentUser, BuyingsController.removeGame);
/*
TODO pay for user
*/


export default router;