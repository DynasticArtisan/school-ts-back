import { NextFunction, Request, Response } from "express";
import ApiError from "../exceptions/ApiError";
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
      return next(ApiError.UnauthorizedError());
    }
    const tokenData = tokenService.validateAccessToken(accessToken);
    if (!tokenData) {
      return next(ApiError.UnauthorizedError());
    }
    // @ts-ignore
    req.user = tokenData;
    next();
  } catch (e) {
    next(e);
  }
}
