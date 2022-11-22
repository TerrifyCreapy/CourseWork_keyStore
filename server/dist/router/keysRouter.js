"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const keys_controller_1 = __importDefault(require("../controllers/keys-controller"));
const authMiddleWare_1 = require("../middleware/authMiddleWare");
const roleMiddleWare_1 = require("../middleware/roleMiddleWare");
const router = express_1.default.Router();
//router.get('/:id',isAuth, KeysController.getKey);
router.post('/', authMiddleWare_1.isAuth, (0, roleMiddleWare_1.isRoles)(["ADMIN"]), keys_controller_1.default.addKeys);
router.post('/send', keys_controller_1.default.sendKeys);
router.post('/:id', authMiddleWare_1.isAuth, (0, roleMiddleWare_1.isRoles)(["ADMIN"]), keys_controller_1.default.editKey);
router.delete('/:id', authMiddleWare_1.isAuth, (0, roleMiddleWare_1.isRoles)(["ADMIN"]), keys_controller_1.default.removeKey);
exports.default = router;
