import { NextFunction, Request, Response } from "express";
import TokenDto from "../dtos/token.dto";
import tokenService from "../services/token.service";

export default async function AuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const accessToken = (req.headers.authorization || "").replace(
      /^Bearer\s/,
      ""
    );
    if (!accessToken) {
      return res.status(403).json("Пользователь не авторизован");
    }
    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) {
      return res.status(401).json("Невалидный токен");
    }
    // @ts-ignore
    req.user = userData;
    next();
  } catch (e) {
    return res.status(403).json("Пользователь не авторизован");
  }
}
