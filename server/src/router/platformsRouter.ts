import express, {Request} from "express";
import PlatformsControllet from "../controllers/platforms-controllet";
import platformsControllet from "../controllers/platforms-controllet";
import roleMiddleWare from "../middleware/roleMiddleWare";
const router = express.Router();

router.get('/', PlatformsControllet.getPlatforms);
// @ts-ignore
router.post('/', roleMiddleWare("ADMIN"), platformsControllet.addPlatform);

export default router;