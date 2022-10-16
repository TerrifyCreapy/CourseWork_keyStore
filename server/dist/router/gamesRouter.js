"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const games_controller_1 = __importDefault(require("../controllers/games-controller"));
const router = express_1.default.Router();
router.get('/', games_controller_1.default.getGames);
router.get('/:id', games_controller_1.default.getGame);
router.post('/', games_controller_1.default.addGames);
router.post('/:id', games_controller_1.default.editGame);
router.delete('/', games_controller_1.default.removeGame);
router.post('/:id/t', games_controller_1.default.editTags);
router.post('/:id/p', games_controller_1.default.editPlatforms);
exports.default = router;
