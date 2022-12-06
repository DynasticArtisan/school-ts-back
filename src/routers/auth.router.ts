import express from "express";
import AuthController from "../controllers/auth.controller";
import Validate from "../middlewares/validate.middleware";
import {
  ActivateUserSchema,
  CreateUserSchema,
  ForgotPasswordSchema,
  LoginUserSchema,
  ResetPasswordSchema,
} from "../schemas/user.schema";

const AuthRouter = express.Router();

AuthRouter.post(
  "/registration",
  Validate(CreateUserSchema),
  AuthController.registration
);
AuthRouter.post(
  "/activation/:user/:activatecode",
  Validate(ActivateUserSchema),
  AuthController.activation
);

AuthRouter.post("/login", Validate(LoginUserSchema), AuthController.login);
AuthRouter.get("/refresh", AuthController.refresh);
AuthRouter.post("/logout", AuthController.logout);

AuthRouter.post(
  "/forgotpassword",
  Validate(ForgotPasswordSchema),
  AuthController.forgotPassword
);
AuthRouter.post(
  "/resetpassword/:userId/:passwordResetCode",
  Validate(ResetPasswordSchema),
  AuthController.resetPassword
);

export default AuthRouter;
