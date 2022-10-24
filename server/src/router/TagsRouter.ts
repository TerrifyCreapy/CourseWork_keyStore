import express from "express";
const router = express.Router();
import TagsController from "../controllers/tags-controller";
import {isAuth} from "../middleware/authMiddleWare";
import {isRoles} from "../middleware/roleMiddleWare";

router.get('/', TagsController.getTags);
router.post('/', isAuth, isRoles(["ADMIN"]), TagsController.addTags);
router.post('/:id', isAuth, isRoles(["ADMIN"]), TagsController.editTag);
router.delete('/:id', isAuth, isRoles(["ADMIN"]), TagsController.removeTag);

export default router;