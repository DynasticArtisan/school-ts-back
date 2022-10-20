import { NextFunction, Request, Response } from "express";
import ApiError from "src/exceptions/ApiError";
import { UserRole } from "src/models/userModel";
import courseConstructionService from "src/services/courseConstructionService";
import courseMastersService from "src/services/courseMastersService";
import courseProgressService from "src/services/courseProgressService";

export default async function CourseAccessMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { course } = req.params;
    req.course = await courseConstructionService.getCourse(course);

    switch (req.user.role) {
      case UserRole.user:
        await courseProgressService.getCourseProgress(req.user.id, course);
        return next();
      case UserRole.teacher || UserRole.curator:
        await courseMastersService.getMaster(req.user.id, course);
        return next();
      case UserRole.super:
        return next();
      default:
        return next(ApiError.Forbidden());
    }
  } catch (e) {
    next(e);
  }
}
