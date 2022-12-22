import { NextFunction, Request, Response } from "express";
import { GetCourseType } from "../schemas/course.schema";
import {
  GetHomeworkType,
  VerifyHomeworkType,
} from "../schemas/homework.schema";
import { GetLessonType } from "../schemas/lesson.schema";
import courseDataService from "../services/courseAccess.service";

class HomeworkController {
  async getCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const Courses = await courseDataService.getHomeworkCoursesByRoles(
        req.user
      );
      res.json(Courses);
    } catch (e) {
      next(e);
    }
  }

  async getCourseLessons(
    req: Request<GetCourseType["params"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId } = req.params;
      const CourseExercises = await courseDataService.getCourseExerciseByRoles(
        courseId,
        req.user
      );
      res.json(CourseExercises);
    } catch (e) {
      next(e);
    }
  }

  async getLessonHomeworks(
    req: Request<GetLessonType["params"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { lessonId } = req.params;
      const LessonHomeworks = await courseDataService.getLessonHomeworksByRole(
        lessonId,
        req.user
      );
      res.json(LessonHomeworks);
    } catch (e) {
      next(e);
    }
  }

  async getHomework(
    req: Request<GetHomeworkType["params"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { homeworkId } = req.params;
      const Homework = await courseDataService.getHomeworkByRoles(
        homeworkId,
        req.user
      );
      res.json(Homework);
    } catch (e) {
      next(e);
    }
  }

  async acceptHomework(
    req: Request<VerifyHomeworkType["params"], {}, VerifyHomeworkType["body"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { homeworkId } = req.params;
      const { comment } = req.body;
      const Homework = await courseDataService.acceptHomeworkByRoles(
        homeworkId,
        comment,
        req.user
      );
      res.json(Homework);
    } catch (e) {
      next(e);
    }
  }

  async rejectHomework(
    req: Request<VerifyHomeworkType["params"], {}, VerifyHomeworkType["body"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { homeworkId } = req.params;
      const { comment } = req.body;
      const Homework = await courseDataService.rejectHomeworkByRoles(
        homeworkId,
        comment,
        req.user
      );
      res.json(Homework);
    } catch (e) {
      next(e);
    }
  }
}
export default new HomeworkController();
