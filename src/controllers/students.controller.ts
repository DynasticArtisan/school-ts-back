import { NextFunction, Request, Response } from "express";
import ApiError from "../exceptions/ApiError";
import courseProgressService from "../services/courseProgress.service";

class StudentsController {
  async createCourseProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, course, format } = req.body;
      if (!user || !course || !format) {
        next(ApiError.BadRequest("Недостаточно данных"));
      }
      const Progress = await courseProgressService.createCourseProgress(
        user,
        course,
        format
      );
      res.json(Progress);
    } catch (e) {
      next(e);
    }
  }
  async updateProgressAccess(req: Request, res: Response, next: NextFunction) {
    try {
      const { student } = req.params;
      const { isAvailable } = req.body;
      const Progress = await courseProgressService.updateCourseProgressAccess(
        student,
        isAvailable
      );
      res.json(Progress);
    } catch (e) {
      next(e);
    }
  }
  async getStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const { student } = req.params;
      const Student = student;
      res.json(Student);
    } catch (e) {
      next(e);
    }
  }
}
export default new StudentsController();
