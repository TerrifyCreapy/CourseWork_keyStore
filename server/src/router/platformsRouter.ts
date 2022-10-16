import express, {Request} from "express";
import PlatformsControllet from "../controllers/platforms-controllet";
import platformsControllet from "../controllers/platforms-controllet";
const router = express.Router();

router.get('/', PlatformsControllet.getPlatforms);
router.post('/', platformsControllet.addPlatform);

export default router;