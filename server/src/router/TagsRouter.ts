import express from "express";
const router = express.Router();
import TagsController from "../controllers/tags-controller";

router.get('/', TagsController.getTags);
router.post('/', TagsController.addTags);

export default router;