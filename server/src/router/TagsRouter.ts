import express, {Request, Response} from "express";
const uuid = require('uuid');
const router = express.Router();
import TagsController from "../controllers/tags-controller";
import {isAuth} from "../middleware/authMiddleWare";
import {isRoles} from "../middleware/roleMiddleWare";
import axios from "axios";

const qiwiBillPaymentsApi = require("@qiwi/bill-payments-node-js-sdk");
let secretKey = "eyJ2ZXJzaW9uIjoiUDJQIiwiZGF0YSI6eyJwYXlpbl9tZXJjaGFudF9zaXRlX3VpZCI6ImJzbGtibi0wMCIsInVzZXJfaWQiOiI3OTY1NzAxNDYwNSIsInNlY3JldCI6ImU3NzRjNDc1OGFhMjQxZGJmZWIwYjU1MDIwMzY1YTljMGNmN2E1NThiZDY2ZjhmN2FjZmIwYjg0YWIwMmQ3ZGEifX0="
let publicKey = "48e7qUxn9T7RyYE1MVZswX1FRSbE6iyCj2gCRwwF3Dnh5XrasNTx3BGPiMsyXQFNKQhvukniQG8RTVhYm3iPpzHphxdu2CUA1FobvUaVdvEhSndenYvjb2MLrSPo9M3S8sncrm6ymDrjQAtDqvdkQF1TyruJD5sdnwN5Yye6n925Nzkg1QjU7gwKuj6u2";
const qiwiAPI = new qiwiBillPaymentsApi(secretKey)

router.get('/', TagsController.getTags);
router.post('/', isAuth, isRoles(["ADMIN"]), TagsController.addTags);
router.post('/:id', isAuth, isRoles(["ADMIN"]), TagsController.editTag);
router.delete('/:id', isAuth, isRoles(["ADMIN"]), TagsController.removeTag);
router.get('/test', async (req,res) => {
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
        }
        //const link = await qiwiAPI.createPaymentForm(params);
        const link = await qiwiAPI.createBill(id, prms);
        res.setHeader("referrer", "http://localhost:3000");
        return res.json({link, date, id});
});

router.get('/checkPay', async(req,res) => {
    const {billId} = req.body;
    const response = await qiwiAPI.getBillInfo(billId);
    return res.json(response);
})

export default router;