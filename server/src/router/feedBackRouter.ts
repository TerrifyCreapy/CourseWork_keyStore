import express, {Request} from "express";
import FeedbackController from "../controllers/feedback-controller";
import {isAuth} from "../middleware/authMiddleWare";
import {currentUser} from "../middleware/currentUserMiddleWare";
import {isRoles} from "../middleware/roleMiddleWare";
const router = express.Router();

router.get('/:id', FeedbackController.getComments);
router.post('/',isAuth, FeedbackController.addComments);
router.delete('/:id',isAuth, FeedbackController.removeComment);

export default router;