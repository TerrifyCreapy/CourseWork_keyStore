"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const keys_controller_1 = __importDefault(require("../controllers/keys-controller"));
const router = express_1.default.Router();
router.get('/:id', keys_controller_1.default.getKey);
router.post('/', keys_controller_1.default.addKeys);
router.post('/:id', keys_controller_1.default.editKey);
router.delete('/:id', keys_controller_1.default.removeKey);
exports.default = router;
