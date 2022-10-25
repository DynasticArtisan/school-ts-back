import express from "express";
import authController from "../controllers/auth.controller";

const {
  validateRegistrationData,
  validateResetPassword,
} = require("../validator");

const authRouter = express.Router();

authRouter.get("/refresh", authController.refresh);

authRouter.post(
  "/registration",
  validateRegistrationData,
  authController.registration
);

authRouter.post("/login", authController.login);
authRouter.get("/activate/:user/:activatecode", authController.activate);
authRouter.post("/logout", authController.logout);

authRouter.post("/forgot-password", authController.forgotPassword);
authRouter.post(
  "/reset-password/:user/:passwordResetCode",
  validateResetPassword,
  authController.resetPassword
);
export default authRouter;
