"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const tags_controller_1 = __importDefault(require("../controllers/tags-controller"));
router.get('/', tags_controller_1.default.getTags);
router.post('/', tags_controller_1.default.addTags);
exports.default = router;
