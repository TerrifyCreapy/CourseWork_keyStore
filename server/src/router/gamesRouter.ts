import express, {Request} from "express";
import GamesController from "../controllers/games-controller";
import {isAuth} from "../middleware/authMiddleWare";
import {isRoles} from "../middleware/roleMiddleWare";
const router = express.Router();

router.get('/', GamesController.getGames);
router.get('/:id', GamesController.getGame);
router.post('/',isAuth, isRoles(["ADMIN"]), GamesController.addGames);
router.post('/:id', isAuth, isRoles(["ADMIN"]), GamesController.editGame);
router.post('/:id/t', isAuth, isRoles(["ADMIN"]), GamesController.editTags);
router.post('/:id/p',  isAuth, isRoles(["ADMIN"]), GamesController.editPlatforms);
router.delete('/:id', isAuth, isRoles(["ADMIN"]), GamesController.deleteGame);

export default router;