"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const platforms_controllet_1 = __importDefault(require("../controllers/platforms-controllet"));
const platforms_controllet_2 = __importDefault(require("../controllers/platforms-controllet"));
const router = express_1.default.Router();
router.get('/', platforms_controllet_1.default.getPlatforms);
router.post('/', platforms_controllet_2.default.addPlatform);
exports.default = router;
