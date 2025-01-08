import express from "express";

import { logout, see, startGithubLogin, finishGithubLogin, getEdit, postEdit, getChangePassword, postChangePassword } from "../controllers/userController";
import { avatarUpload, protectorMiddleware } from "../middlewares";

const userRouter = express.Router();

userRouter.get("/logout", protectorMiddleware, logout);
userRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(avatarUpload.single("avatar"), postEdit);
userRouter.route("/change-password").all(protectorMiddleware).get(getChangePassword).post(postChangePassword);

userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);

userRouter.get("/:id", see);

export default userRouter;