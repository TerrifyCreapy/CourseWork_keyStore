import express, {Request} from "express";
import KeysController from "../controllers/keys-controller";
const router = express.Router();

router.get('/:id', KeysController.getKey);
router.post('/', KeysController.addKeys);
router.post('/:id', KeysController.editKey);
router.delete('/:id', KeysController.removeKey);

export default router;