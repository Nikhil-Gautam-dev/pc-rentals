import { Router } from "express";
import jwtVerify from "../middlewares/auth.middleware.js";
import { createOrder, verifyOrder, getMetaData } from "./payment.controller.js";

const router = Router();

router.route("/create").post(jwtVerify, createOrder);
router.route("/verify").post(jwtVerify, verifyOrder);
router.route("/meta-data").get(jwtVerify, getMetaData);

export default router;
