import express from "express";
import * as authController from "../controller/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

let authRouter = express.Router();




authRouter.post("/register",authController.registerUser);
authRouter.post("/login",authController.loginUser);
authRouter.get("/logout",authController.logoutUser);
authRouter.get("/me", authMiddleware, authController.getUser )
authRouter.post("/refresh", authController.refreshToken)



export default authRouter;