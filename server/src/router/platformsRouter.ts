import express from "express";
import platformsController from "../controllers/platforms-controller";
import {isRoles} from "../middleware/roleMiddleWare";
import {isAuth} from "../middleware/authMiddleWare";
const router = express.Router();

router.get('/', platformsController.getPlatforms);
router.post('/', isAuth, isRoles(["ADMIN"]), platformsController.addPlatform);
router.post('/:id', isAuth, isRoles(["ADMIN"]), platformsController.editPlatform);
router.delete('/:id', isAuth, isRoles(["ADMIN"]), platformsController.removePlatform);

export default router;