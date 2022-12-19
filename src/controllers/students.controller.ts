import { NextFunction, Request, Response } from "express";
import {
  CreateStudentType,
  GetStudentType,
  UpdStudentAccessType,
} from "../schemas/student.schema";
import courseAccessService from "../services/courseAccess.service";
import courseProgressService from "../services/courseProgress.service";

class StudentsController {
  async createStudent(
    req: Request<{}, {}, CreateStudentType["body"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId, courseId, format } = req.body;
      const Student = await courseProgressService.createCourseProgress(
        userId,
        courseId,
        format
      );
      res.json(Student);
    } catch (e) {
      next(e);
    }
  }

  async getStudentProfile(
    req: Request<GetStudentType["params"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { studentId } = req.params;
      const Profile = await courseAccessService.getStudentProfileByRoles(
        studentId,
        req.user
      );
      res.json(Profile);
    } catch (e) {
      next(e);
    }
  }

  async updateStudentAccess(
    req: Request<
      UpdStudentAccessType["params"],
      {},
      UpdStudentAccessType["body"]
    >,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { studentId } = req.params;
      const { isAvailable } = req.body;
      const Progress =
        await courseProgressService.updateCourseProgressAccessById(
          studentId,
          isAvailable
        );
      res.json(Progress);
    } catch (e) {
      next(e);
    }
  }
}

export default new StudentsController();
