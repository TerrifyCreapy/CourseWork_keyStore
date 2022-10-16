"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("../controllers/user-controller"));
const user_controller_2 = __importDefault(require("../controllers/user-controller"));
const router = express_1.default.Router();
router.get('/', user_controller_1.default.getUsers);
router.get('/auth', user_controller_1.default.isAuth);
router.post('/registration', user_controller_1.default.registration);
router.post('/login', user_controller_2.default.login);
router.post('/edit/:id', user_controller_1.default.editUser);
exports.default = router;
