import express from "express";
import authController from "../controllers/auth.controller";

const authRouter = express.Router();

authRouter.get("/refresh", authController.refresh);

authRouter.post("/registration", authController.registration);

authRouter.post("/login", authController.login);
authRouter.post("/activation/:user/:activatecode", authController.activation);
authRouter.post("/logout", authController.logout);

authRouter.post("/forgotpassword", authController.forgotPassword);
authRouter.post(
  "/resetpassword/:user/:passwordResetCode",
  authController.resetPassword
);
export default authRouter;
