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
      // res.cookie('refreshToken', UserData.refreshToken, { maxAge: 30*24*60*60*1000, httpOnly: true });
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
      const { link } = req.params;
      await authService.activate(link);
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
      await authService.forgotPassword(email);
      return res
        .status(200)
        .json({ message: "На указаную почту отправлено письмо" });
    } catch (e) {
      next(e);
    }
  }

  async getResetToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, token } = req.params;
      const resetToken = await authService.getResetToken(id, token);
      res.cookie("resetToken", resetToken, {
        maxAge: 10 * 60 * 1000,
        httpOnly: true,
      });
      res.redirect(config.get("ClientURL") + "/recover/" + id);
    } catch (e) {
      next(e);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, newPassword } = req.body;
      const { resetToken } = req.cookies;
      const userData = await authService.resetPassword(
        id,
        resetToken,
        newPassword
      );
      res.clearCookie("resetToken");
      res.json(userData);
    } catch (e) {
      next(e);
    }
  }
}

export default new AuthController();
