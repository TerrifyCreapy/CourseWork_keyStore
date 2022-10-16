import express, {Request} from "express";
import FeedbackController from "../controllers/feedback-controller";
const router = express.Router();

router.get('/', FeedbackController.getComments);
router.post('/', FeedbackController.addComments);
router.delete('/:id', FeedbackController.removeComment);

export default router;