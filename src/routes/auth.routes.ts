import { UserController } from "controller/user.controller";
import { Router, type Router as ExpressRouter } from "express";
import { authMiddleware } from "middleware/auth.middleware";

const authRouter: ExpressRouter = Router();

// POST /auth/login
authRouter.post("/login", UserController.login);
// POST /auth/logout
authRouter.post("/logout", authMiddleware, UserController.logout);

export default authRouter;
