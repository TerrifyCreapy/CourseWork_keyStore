import express, {Request} from "express";
import GamesController from "../controllers/games-controller";
const router = express.Router();

router.get('/', GamesController.getGames);
router.get('/:id', GamesController.getGame);
router.post('/', GamesController.addGames);
router.post('/:id', GamesController.editGame);
router.delete('/', GamesController.removeGame);
router.post('/:id/t', GamesController.editTags);
router.post('/:id/p', GamesController.editPlatforms);

export default router;