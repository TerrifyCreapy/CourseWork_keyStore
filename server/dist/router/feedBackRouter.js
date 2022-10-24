"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const feedback_controller_1 = __importDefault(require("../controllers/feedback-controller"));
const authMiddleWare_1 = require("../middleware/authMiddleWare");
const currentUserMiddleWare_1 = require("../middleware/currentUserMiddleWare");
const roleMiddleWare_1 = require("../middleware/roleMiddleWare");
const router = express_1.default.Router();
router.get('/', feedback_controller_1.default.getComments);
router.post('/', authMiddleWare_1.isAuth, feedback_controller_1.default.addComments);
router.post('/:id', authMiddleWare_1.isAuth, currentUserMiddleWare_1.currentUser, (0, roleMiddleWare_1.isRoles)(["ADMIN", "MODER"]), feedback_controller_1.default.editComment);
router.delete('/:id', authMiddleWare_1.isAuth, currentUserMiddleWare_1.currentUser, (0, roleMiddleWare_1.isRoles)(["ADMIN", "MODER"]), feedback_controller_1.default.removeComment);
exports.default = router;
