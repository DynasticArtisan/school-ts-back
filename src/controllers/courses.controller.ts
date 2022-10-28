import { NextFunction, Request, Response } from "express";
import ApiError from "../exceptions/ApiError";
import { CourseInput } from "../models/course.model";
import courseDataService from "../services/courseData.service";
import courseService from "../services/course.service";

class CoursesController {
  async createCourse(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.files || Array.isArray(req.files)) {
        return next(ApiError.BadRequest("Изображения не найдены"));
      }
      const image = req.files["image"][0];
      const icon = req.files["icon"][0];
      if (!image || !icon) {
        return next(ApiError.BadRequest("Изображения не найдены"));
      }
      const { title, subtitle, description } = req.body;
      const Course = await courseService.createCourse({
        title,
        subtitle,
        description,
        image: "images/" + image.filename,
        icon: "images/" + icon.filename,
      });
      res.json(Course);
    } catch (e) {
      next(e);
    }
  }
  async updateCourse(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.files || Array.isArray(req.files)) {
        return next(ApiError.BadRequest("Изображения не найдены"));
      }
      const image = req.files["image"][0];
      const icon = req.files["icon"][0];
      const { course } = req.params;
      const { title, subtitle, description } = req.body;
      const courseData: CourseInput = { title, subtitle, description };
      if (icon) {
        courseData.icon = "images/" + icon.filename;
      }
      if (image) {
        courseData.image = "images/" + image.filename;
      }
      const Course = await courseService.updateCourse(course, courseData);
      res.json(Course);
    } catch (e) {
      next(e);
    }
  }
  async deleteCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { course } = req.params;
      await courseService.deleteCourse(course);
      res.json({ message: "Курс удален" });
    } catch (e) {
      next(e);
    }
  }

  async getCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const Courses = await courseDataService.getCoursesByRoles(req.user);
      res.json(Courses);
    } catch (e) {
      next(e);
    }
  }
  async createModule(req: Request, res: Response, next: NextFunction) {
    try {
      const { course } = req.params;
      const { title, description } = req.body;
      if (!course || !title || !description) {
        next(ApiError.BadRequest("Недостаточно данных"));
      }
      const Module = await courseService.createModule(
        course,
        title,
        description
      );
      res.json(Module);
    } catch (e) {
      next(e);
    }
  }
  async getModules(req: Request, res: Response, next: NextFunction) {
    try {
      const { course } = req.params;
      const Course = await courseDataService.getCourseModulesByRoles(
        course,
        req.user
      );
      res.json(Course);
    } catch (e) {
      next(e);
    }
  }

  async getStudents(req: Request, res: Response, next: NextFunction) {
    try {
      const { course } = req.params;
      const CourseStudents = await courseDataService.getCourseStudentsByRoles(
        course,
        req.user
      );
      res.json(CourseStudents);
    } catch (e) {
      next(e);
    }
  }
}

export default new CoursesController();
