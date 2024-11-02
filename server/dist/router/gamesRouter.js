"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const games_controller_1 = __importDefault(require("../controllers/games-controller"));
const authMiddleWare_1 = require("../middleware/authMiddleWare");
const roleMiddleWare_1 = require("../middleware/roleMiddleWare");
const router = express_1.default.Router();
router.get('/', games_controller_1.default.getGames);
router.get('/:id', games_controller_1.default.getGame);
router.post('/', authMiddleWare_1.isAuth, (0, roleMiddleWare_1.isRoles)(["ADMIN"]), games_controller_1.default.addGames);
router.post('/:id', authMiddleWare_1.isAuth, (0, roleMiddleWare_1.isRoles)(["ADMIN"]), games_controller_1.default.editGame);
router.post('/:id/t', authMiddleWare_1.isAuth, (0, roleMiddleWare_1.isRoles)(["ADMIN"]), games_controller_1.default.editTags);
router.post('/:id/p', authMiddleWare_1.isAuth, (0, roleMiddleWare_1.isRoles)(["ADMIN"]), games_controller_1.default.editPlatforms);
router.delete('/:id', authMiddleWare_1.isAuth, (0, roleMiddleWare_1.isRoles)(["ADMIN"]), games_controller_1.default.deleteGame);
exports.default = router;
