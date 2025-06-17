import { Router } from "express";
import {
	chat,
	login,
	signUp,
	verifyAuthCode,
} from "../controllers/userController.js";
import verifyToken from "../middleware.js";
const userRouter = Router();

userRouter.post("/signup", signUp);
userRouter.post("/login", login);
userRouter.post("/chat", verifyToken, chat);
userRouter.post("/verify-authcode", verifyAuthCode);

export default userRouter;
