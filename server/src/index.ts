//import all dependencies
import express, {Request, Response} from "express";
const cors = require('cors');
const referrerPolicy = require('referrer-policy');
require('dotenv').config();
const cookies = require('cookie-parser');
const dbSequelize = require("./db");
const fileUpload = require('express-fileupload');
import router from "./router/router";
import ErrorHandler from "./middleware/ErrorHandlerMDWR";
import path from "path";

const models = require("./models/models");
//taking port from .env file
const PORT = process.env.SERVER_PORT || 3002;

//init backend
const app = express();
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));
app.use(referrerPolicy({policy: "no-referrer-when-downgrade"}));
app.use(express.json());
app.use(cookies());
app.use(express.static(path.resolve(__dirname, '..', 'static')));
app.use(fileUpload({}));
app.use('/api', router);

//Обработка ошибок в конце.
app.use(ErrorHandler)




async function start() {
    try {
        await dbSequelize.authenticate();
        await dbSequelize.sync();
        app.listen(PORT,() => console.log(`server started at port ${PORT}`));
    }
    catch (e) {
        console.error(e);
    }
}

start();


