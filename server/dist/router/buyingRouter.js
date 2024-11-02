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
router.get('/', authMiddleWare_1.isAuth, currentUserMiddleWare_1.currentUser, (0, roleMiddleWare_1.isRoles)(["MODER", "ADMIN"]), buyings_controller_1.default.getBuyings);
router.get('/games', authMiddleWare_1.isAuth, buyings_controller_1.default.getAllGamesBougth);
router.get('/basket', authMiddleWare_1.isAuth, currentUserMiddleWare_1.currentUser, buyings_controller_1.default.getBasket);
router.get('/history', authMiddleWare_1.isAuth, currentUserMiddleWare_1.currentUser, buyings_controller_1.default.getHistory);
router.post('/game', authMiddleWare_1.isAuth, currentUserMiddleWare_1.currentUser, buyings_controller_1.default.addGame);
router.delete('/game', authMiddleWare_1.isAuth, currentUserMiddleWare_1.currentUser, buyings_controller_1.default.removeGame);
router.get("/test", buyings_controller_1.default.test);
router.post("/createPayment", authMiddleWare_1.isAuth, currentUserMiddleWare_1.currentUser, buyings_controller_1.default.createPayment);
/*
TODO pay for user
*/
exports.default = router;
