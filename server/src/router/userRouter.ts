import express from "express";
import UserController from "../controllers/user-controller";
import userController from "../controllers/user-controller";
const router = express.Router();


router.get('/', UserController.getUsers);
router.get('/auth', UserController.isAuth);
router.post('/registration', UserController.registration);
router.post('/login', userController.login);
router.post('/edit/:id', UserController.editUser);



export default router;