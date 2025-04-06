import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  addPC,
  deletePCById,
  getAllPCs,
  getPCById,
  getPCByUserId,
} from "../controllers/pc.controllers.js";
import jwtVerify, { isAdmin } from "../middlewares/auth.middleware.js";

const pcRouter = Router();

pcRouter.route("/").post(upload.single("pcImg"), addPC);
pcRouter.route("/").delete(jwtVerify, isAdmin, deletePCById);
pcRouter.route("/").get(getAllPCs);
pcRouter.route("/getPCById").get(getPCById);
pcRouter.route("/getPCByUserId").get(jwtVerify, getPCByUserId);

export default pcRouter;
