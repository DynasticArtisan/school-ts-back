import { NextFunction, Request, Response } from "express";
import {
  ActivateUserReq,
  CreateUserReq,
  LoginUserReq,
  RefreshReq,
} from "../schemas/user.schema";
import authService from "../services/auth.service";
import tokenService from "../services/token.service";

class AuthController {
  async registration(
    req: Request<{}, {}, CreateUserReq["body"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { name, lastname, email, password } = req.body;
      const message = await authService.registration(
        name,
        lastname,
        email,
        password
      );
      return res.json({ message });
    } catch (e) {
      next(e);
    }
  }
  async activation(
    req: Request<ActivateUserReq["params"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { user, activatecode } = req.params;
      await authService.activate(user, activatecode);
      res.json({ message: "Активация прошла успешно" });
    } catch (e) {
      next(e);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const message = await authService.forgotPassword(email);
      res.json(message);
    } catch (e) {
      next(e);
    }
  }
  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, passwordResetCode } = req.params;
      const { password } = req.body;
      const message = await authService.resetPassword(
        user,
        passwordResetCode,
        password
      );
      return res.status(200).json(message);
    } catch (e) {
      next(e);
    }
  }

  async login(
    req: Request<{}, {}, LoginUserReq["body"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email, password, remember } = req.body;
      const { user, accessToken, refreshToken } = await authService.login(
        email,
        password,
        remember
      );
      if (remember) {
        res.cookie("refreshToken", refreshToken, {
          maxAge: 30 * 24 * 60 * 60 * 1000,
          httpOnly: true,
        });
      } else {
        res.cookie("refreshToken", refreshToken, { httpOnly: true });
      }
      return res.json({ user, accessToken });
    } catch (e) {
      next(e);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, remember, accessToken, refreshToken } =
        await authService.refresh(req.cookies.refreshToken);

      if (remember) {
        res.cookie("refreshToken", refreshToken, {
          maxAge: 30 * 24 * 60 * 60 * 1000,
          httpOnly: true,
        });
      } else {
        res.cookie("refreshToken", refreshToken, { httpOnly: true });
      }

      return res.json({ user, accessToken });
    } catch (e) {
      next(e);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      await tokenService.removeToken(refreshToken);
      res.clearCookie("refreshToken");
      res.send();
    } catch (e) {
      next(e);
    }
  }
}

export default new AuthController();
