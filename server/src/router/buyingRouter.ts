import express from "express";
import BuyingsController from "../controllers/buyings-controller";
import {isAuth} from "../middleware/authMiddleWare";
import {isRoles} from "../middleware/roleMiddleWare";
import {currentUser} from "../middleware/currentUserMiddleWare";
const router = express.Router();

router.get('/', isAuth, currentUser,isRoles(["MODER" ,"ADMIN"]),BuyingsController.getBuyings);
router.get('/games', isAuth, BuyingsController.getAllGamesBougth);
router.get('/basket', isAuth, currentUser, BuyingsController.getBasket);
router.get('/history',isAuth, currentUser, BuyingsController.getHistory)
router.post('/game', isAuth, currentUser, BuyingsController.addGame);
router.delete('/game', isAuth, currentUser, BuyingsController.removeGame);
router.get("/test", BuyingsController.test)
router.post("/createPayment", isAuth, currentUser, BuyingsController.createPayment);
/*
TODO pay for user
*/


export default router;