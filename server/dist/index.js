"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import all dependencies
const express_1 = __importDefault(require("express"));
const cors = require('cors');
const referrerPolicy = require('referrer-policy');
require('dotenv').config();
const cookies = require('cookie-parser');
const dbSequelize = require("./db");
const fileUpload = require('express-fileupload');
const router_1 = __importDefault(require("./router/router"));
const ErrorHandlerMDWR_1 = __importDefault(require("./middleware/ErrorHandlerMDWR"));
const path_1 = __importDefault(require("path"));
const models = require("./models/models");
//taking port from .env file
const PORT = process.env.SERVER_PORT || 3002;
//init backend
const app = (0, express_1.default)();
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));
app.use(referrerPolicy({ policy: "no-referrer-when-downgrade" }));
app.use(express_1.default.json());
app.use(cookies());
app.use(express_1.default.static(path_1.default.resolve(__dirname, '..', 'static')));
app.use(fileUpload({}));
app.use('/api', router_1.default);
//Обработка ошибок в конце.
app.use(ErrorHandlerMDWR_1.default);
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield dbSequelize.authenticate();
            yield dbSequelize.sync();
            app.listen(PORT, () => console.log(`server started at port ${PORT}`));
        }
        catch (e) {
            console.error(e);
        }
    });
}
start();
