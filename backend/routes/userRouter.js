import { Router } from "express";
import {
	chat,
	login,
	signUp,
	verifyEmailCode,
	resetPassword,
	requestPasswordReset,
} from "../controllers/userController.js";
import verifyToken from "../middleware.js";
const userRouter = Router();

userRouter.post("/signup", signUp);
userRouter.post("/login", login);
userRouter.post("/chat", verifyToken, chat);
userRouter.post("/verify-email-code", verifyEmailCode);
userRouter.post("/reset-password", resetPassword);
userRouter.post("/request-password-reset", requestPasswordReset);

export default userRouter;
