import { NextFunction, Request, Response } from "express";
import config from "config";
import authService from "../services/auth.service";
import tokenService from "../services/token.service";

class AuthController {
  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      const { remember } = req.query;
      const User = await authService.refresh(refreshToken);
      if (remember) {
        res.cookie("refreshToken", User.refreshToken, {
          maxAge: 30 * 24 * 60 * 60 * 1000,
          httpOnly: true,
        });
      } else {
        res.cookie("refreshToken", User.refreshToken, { httpOnly: true });
      }
      return res.json(User);
    } catch (e) {
      next(e);
    }
  }

  async registration(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, surname, email, password } = req.body;
      const User = await authService.registration(
        name,
        surname,
        email,
        password
      );
      return res.json(User);
    } catch (e) {
      next(e);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, remember } = req.body;
      const User = await authService.login(email, password);
      if (remember) {
        res.cookie("refreshToken", User.refreshToken, {
          maxAge: 30 * 24 * 60 * 60 * 1000,
          httpOnly: true,
        });
      } else {
        res.cookie("refreshToken", User.refreshToken, { httpOnly: true });
      }
      return res.json(User);
    } catch (e) {
      next(e);
    }
  }

  async activate(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, activatecode } = req.params;
      await authService.activate(activatecode);
      return res.redirect(config.get("ClientURL"));
      // на страницу спасибо
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

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const message = await authService.forgotPassword(email);
      return res.status(200).json(message);
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
}

export default new AuthController();
