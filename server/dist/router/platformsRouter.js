"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const platforms_controller_1 = __importDefault(require("../controllers/platforms-controller"));
const roleMiddleWare_1 = require("../middleware/roleMiddleWare");
const authMiddleWare_1 = require("../middleware/authMiddleWare");
const router = express_1.default.Router();
router.get('/', platforms_controller_1.default.getPlatforms);
router.post('/', authMiddleWare_1.isAuth, (0, roleMiddleWare_1.isRoles)(["ADMIN"]), platforms_controller_1.default.addPlatform);
router.post('/:id', authMiddleWare_1.isAuth, (0, roleMiddleWare_1.isRoles)(["ADMIN"]), platforms_controller_1.default.editPlatform);
router.delete('/:id', authMiddleWare_1.isAuth, (0, roleMiddleWare_1.isRoles)(["ADMIN"]), platforms_controller_1.default.removePlatform);
exports.default = router;
