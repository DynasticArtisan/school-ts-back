import { NextFunction, Request, Response } from "express";
import courseDataService from "../services/courseData.service";
import homeworkService from "../services/homework.service";

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
  async getCourseLessons(req: Request, res: Response, next: NextFunction) {
    try {
      const { course } = req.params;
      const CourseExercises = await courseDataService.getCourseExerciseByRoles(
        course,
        req.user
      );
      res.json(CourseExercises);
    } catch (e) {
      next(e);
    }
  }
  async getLessonHomeworks(req: Request, res: Response, next: NextFunction) {
    try {
      const { lesson } = req.params;
      const LessonHomeworks = await courseDataService.getLessonHomeworksByRole(
        lesson,
        req.user
      );
      res.json(LessonHomeworks);
    } catch (e) {
      next(e);
    }
  }
  async getHomework(req: Request, res: Response, next: NextFunction) {
    try {
      const { homework } = req.params;
      const Homework = await homeworkService.getHomeworkByRoles(
        homework,
        req.user
      );
      res.json(Homework);
    } catch (e) {
      next(e);
    }
  }

  async acceptHomework(req: Request, res: Response, next: NextFunction) {
    try {
      const { homework } = req.params;
      const Homework = await homeworkService.acceptHomeworkByRoles(
        homework,
        req.user
      );
      res.json(Homework);
    } catch (e) {
      next(e);
    }
  }
  async rejectHomework(req: Request, res: Response, next: NextFunction) {
    try {
      const { homework } = req.params;
      const Homework = await homeworkService.rejectHomeworkByRoles(
        homework,
        req.user
      );
      res.json(Homework);
    } catch (e) {
      next(e);
    }
  }
}
export default new HomeworkController();
