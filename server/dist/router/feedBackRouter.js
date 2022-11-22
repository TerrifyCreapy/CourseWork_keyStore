"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const feedback_controller_1 = __importDefault(require("../controllers/feedback-controller"));
const authMiddleWare_1 = require("../middleware/authMiddleWare");
const router = express_1.default.Router();
router.get('/:id', feedback_controller_1.default.getComments);
router.post('/', authMiddleWare_1.isAuth, feedback_controller_1.default.addComments);
router.delete('/:id', authMiddleWare_1.isAuth, feedback_controller_1.default.removeComment);
exports.default = router;
