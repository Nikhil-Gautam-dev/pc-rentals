import express from "express";
import { rentPc, getOrderById } from "../controllers/rentpc.controllers.js";
import jwtVerify from "../middlewares/auth.middleware.js";

const rentPcRouter = express.Router();

rentPcRouter.route("/").post(jwtVerify, rentPc);
rentPcRouter.route("/getOrderById").get(jwtVerify, getOrderById);

export default rentPcRouter;
