import { Router } from "express";
import {
  getUserProfile,
  login,
  signup,
  superUserSignin,
  signupUsingPasskey,
  getAllUsers,
} from "../controllers/user.controllers.js";
import jwtVerify, { isAdmin } from "../middlewares/auth.middleware.js";

const userRouter = Router();

// User login route
userRouter.post("/login", login);

// User signup route
userRouter.post("/signup", signup);

// Super user signup route
userRouter.post("/superuser-signup", superUserSignin);
userRouter.post("/passkey", signupUsingPasskey);

userRouter.get("/profile", jwtVerify, getUserProfile);

userRouter.get("/getAll", jwtVerify, getAllUsers);

export default userRouter;
