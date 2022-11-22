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
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = require("nodemailer");
class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: "pro100topchannal@gmail.com",
                pass: "gznvbryxbjivsrqj"
            }
        }, {
            from: "KeyStore <pro100topchannal@gmail.com>"
        });
    }
    sendActivation(to, link) {
        return __awaiter(this, void 0, void 0, function* () {
            const mail = yield this.transporter.sendMail({
                to,
                subject: "Активация аккаунта на " + process.env.API_URL,
                text: "",
                html: `
                             <div>
                                <h1>Для активации перейдите по ссылке</h1>
                                <a href="${link}">${link}</a>
                             </div>   
                        `
            });
        });
    }
    sendKeys(to, keys, buyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const mail = yield this.transporter.sendMail({
                to,
                subject: `Заказ №${buyId}`,
                text: `${keys.map((e) => { return e.gameName + "/" + e.platformName + "\n" + e.keys.join("\n") + "\n\n"; })}`
            });
        });
    }
}
exports.default = new MailService();
