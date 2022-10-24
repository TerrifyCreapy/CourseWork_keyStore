import express, {Request} from "express";
import FeedbackController from "../controllers/feedback-controller";
import {isAuth} from "../middleware/authMiddleWare";
import {currentUser} from "../middleware/currentUserMiddleWare";
import {isRoles} from "../middleware/roleMiddleWare";
const router = express.Router();

router.get('/', FeedbackController.getComments);
router.post('/',isAuth, FeedbackController.addComments);
router.post('/:id', isAuth, currentUser, isRoles(["ADMIN", "MODER"]), FeedbackController.editComment);
router.delete('/:id',isAuth, currentUser, isRoles(["ADMIN", "MODER"]), FeedbackController.removeComment);

export default router;