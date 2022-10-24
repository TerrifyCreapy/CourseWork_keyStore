"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const tags_controller_1 = __importDefault(require("../controllers/tags-controller"));
const authMiddleWare_1 = require("../middleware/authMiddleWare");
const roleMiddleWare_1 = require("../middleware/roleMiddleWare");
router.get('/', tags_controller_1.default.getTags);
router.post('/', authMiddleWare_1.isAuth, (0, roleMiddleWare_1.isRoles)(["ADMIN"]), tags_controller_1.default.addTags);
router.post('/:id', authMiddleWare_1.isAuth, (0, roleMiddleWare_1.isRoles)(["ADMIN"]), tags_controller_1.default.editTag);
router.delete('/:id', authMiddleWare_1.isAuth, (0, roleMiddleWare_1.isRoles)(["ADMIN"]), tags_controller_1.default.removeTag);
exports.default = router;
