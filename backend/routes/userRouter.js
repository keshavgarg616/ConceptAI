import { Router } from "express";
import { chat, login, signUp } from "../controllers/userController.js";
import verifyToken from "../middleware.js";
const userRouter = Router();

userRouter.post("/signup", signUp);
userRouter.post("/login", login);
userRouter.post("/chat", verifyToken, chat);

export default userRouter;
