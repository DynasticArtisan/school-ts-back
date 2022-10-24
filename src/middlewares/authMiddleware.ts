import { NextFunction, Request, Response } from "express";
import tokenService from "../services/token.service";

export default async function AuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return res.status(403).json("Доступ запрещен");
    }
    const accessToken = authorizationHeader.split(" ")[1];
    if (!accessToken) {
      return res.status(403).json("Доступ запрещен");
    }
    const userData = await tokenService.validateAccessToken(accessToken);
    if (!userData) {
      return res.status(401).json("Доступ запрещен");
    }
    if (!userData.isActivated) {
      return res.status(403).json("Доступ запрещен");
    }
    req.user = userData;
    next();
  } catch (e) {
    return res.status(403).json("Доступ запрещен");
  }
}
