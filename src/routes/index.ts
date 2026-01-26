import { Router, type Router as ExpressRouter } from "express";
import userRouter from "./user.routes";
import authRouter from "./auth.routes";
import postRouter from "./post.routes";
import uploadRouter from "./upload.routes";
import categoryRouter from "./category.routes";

const routes: ExpressRouter = Router();
routes.use("/auth", authRouter);
routes.use("/user", userRouter);
routes.use("/post", postRouter);
routes.use("/upload", uploadRouter);
routes.use("/category", categoryRouter);

export default routes;
