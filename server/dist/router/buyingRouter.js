"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const buyings_controller_1 = __importDefault(require("../controllers/buyings-controller"));
const authMiddleWare_1 = require("../middleware/authMiddleWare");
const roleMiddleWare_1 = require("../middleware/roleMiddleWare");
const currentUserMiddleWare_1 = require("../middleware/currentUserMiddleWare");
const router = express_1.default.Router();
router.get('/', authMiddleWare_1.isAuth, currentUserMiddleWare_1.currentUser, (0, roleMiddleWare_1.isRoles)(["MODER", "ADMIN"]), buyings_controller_1.default.getBuyings); //Получение списка пользователей(Только роль модератора и администратора)
router.post('/pay/:id', authMiddleWare_1.isAuth, currentUserMiddleWare_1.currentUser, buyings_controller_1.default.setStatusPaying);
router.post('/game', authMiddleWare_1.isAuth, currentUserMiddleWare_1.currentUser, buyings_controller_1.default.addGame);
router.delete('/game', authMiddleWare_1.isAuth, currentUserMiddleWare_1.currentUser, buyings_controller_1.default.removeGame);
/*
TODO pay for user
*/
exports.default = router;
