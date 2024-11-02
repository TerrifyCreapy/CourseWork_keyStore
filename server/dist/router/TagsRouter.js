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
const express_1 = __importDefault(require("express"));
const uuid = require('uuid');
const router = express_1.default.Router();
const tags_controller_1 = __importDefault(require("../controllers/tags-controller"));
const authMiddleWare_1 = require("../middleware/authMiddleWare");
const roleMiddleWare_1 = require("../middleware/roleMiddleWare");
const qiwiBillPaymentsApi = require("@qiwi/bill-payments-node-js-sdk");
let secretKey = "eyJ2ZXJzaW9uIjoiUDJQIiwiZGF0YSI6eyJwYXlpbl9tZXJjaGFudF9zaXRlX3VpZCI6ImJzbGtibi0wMCIsInVzZXJfaWQiOiI3OTY1NzAxNDYwNSIsInNlY3JldCI6ImU3NzRjNDc1OGFhMjQxZGJmZWIwYjU1MDIwMzY1YTljMGNmN2E1NThiZDY2ZjhmN2FjZmIwYjg0YWIwMmQ3ZGEifX0=";
let publicKey = "48e7qUxn9T7RyYE1MVZswX1FRSbE6iyCj2gCRwwF3Dnh5XrasNTx3BGPiMsyXQFNKQhvukniQG8RTVhYm3iPpzHphxdu2CUA1FobvUaVdvEhSndenYvjb2MLrSPo9M3S8sncrm6ymDrjQAtDqvdkQF1TyruJD5sdnwN5Yye6n925Nzkg1QjU7gwKuj6u2";
const qiwiAPI = new qiwiBillPaymentsApi(secretKey);
router.get('/', tags_controller_1.default.getTags);
router.post('/', authMiddleWare_1.isAuth, (0, roleMiddleWare_1.isRoles)(["ADMIN"]), tags_controller_1.default.addTags);
router.post('/:id', authMiddleWare_1.isAuth, (0, roleMiddleWare_1.isRoles)(["ADMIN"]), tags_controller_1.default.editTag);
router.delete('/:id', authMiddleWare_1.isAuth, (0, roleMiddleWare_1.isRoles)(["ADMIN"]), tags_controller_1.default.removeTag);
router.get('/test', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //const date = qiwiAPI.getLifetimeByDay(0.01388888888);
    const date = qiwiAPI.getLifetimeByDay(0.00069444444);
    const id = uuid.v4();
    const params = {
        publicKey,
        amount: 10,
        billId: id,
        successUrl: "http://localhost:3000/",
        expirationDateTime: date
    };
    const prms = {
        amount: 1.00,
        currency: "RUB",
        comment: "Test",
        expirationDateTime: date,
        successUrl: 'http://test.ru/'
    };
    //const link = await qiwiAPI.createPaymentForm(params);
    const link = yield qiwiAPI.createBill(id, prms);
    res.setHeader("referrer", "http://localhost:3000");
    return res.json({ link, date, id });
}));
router.get('/checkPay', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { billId } = req.body;
    const response = yield qiwiAPI.getBillInfo(billId);
    return res.json(response);
}));
exports.default = router;
