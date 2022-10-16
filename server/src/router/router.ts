import express from "express";
import feedBackRouter from "./feedBackRouter";
import gamesRouter from "./gamesRouter";
import keysRouter from "./keysRouter";
import platformsRouter from "./platformsRouter";
import tagsRouter from "./TagsRouter";
import userRouter from "./userRouter";
const router = express.Router();


router.use('/user', userRouter);
router.use('/games', gamesRouter);
router.use('/feedback', feedBackRouter);
router.use('/keys', keysRouter);
router.use('/platforms', platformsRouter);
router.use('/tags', tagsRouter);


export default router;