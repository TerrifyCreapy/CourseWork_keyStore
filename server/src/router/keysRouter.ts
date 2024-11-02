import express from "express";
import KeysController from "../controllers/keys-controller";
import {isAuth} from "../middleware/authMiddleWare";
import { currentUser } from "../middleware/currentUserMiddleWare";
import {isRoles} from "../middleware/roleMiddleWare";
const router = express.Router();

//router.get('/:id',isAuth, KeysController.getKey);
router.post('/',isAuth, isRoles(["ADMIN"]), KeysController.addKeys);
router.post('/send',KeysController.sendKeys);
router.post('/:id',isAuth, isRoles(["ADMIN"]), KeysController.editKey);
router.delete('/:id',isAuth, isRoles(["ADMIN"]), KeysController.removeKey);

export default router;