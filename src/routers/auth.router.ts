import express from "express";
import authController from "../controllers/auth.controller";
import Validate from "../middlewares/validate.middleware";
import {
  ActivateUserSchema,
  CreateUserSchema,
  LoginUserSchema,
  RefreshSchema,
} from "../schemas/user.schema";

const authRouter = express.Router();

authRouter.post(
  "/registration",
  Validate(CreateUserSchema),
  authController.registration
);
authRouter.post(
  "/activation/:user/:activatecode",
  Validate(ActivateUserSchema),
  authController.activation
);

authRouter.post("/login", Validate(LoginUserSchema), authController.login);
authRouter.get("/refresh", Validate(RefreshSchema), authController.refresh);
authRouter.post("/logout", authController.logout);

authRouter.post("/forgotpassword", authController.forgotPassword);
authRouter.post(
  "/resetpassword/:user/:passwordResetCode",
  authController.resetPassword
);

export default authRouter;
