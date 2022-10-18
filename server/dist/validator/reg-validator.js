"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { validationResult } = require("express-validator");
function default_1(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next;
}
exports.default = default_1;
