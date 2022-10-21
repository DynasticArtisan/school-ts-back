import { NextFunction, Request, Response } from "express";
import ApiError from "src/exceptions/ApiError";
import { CourseInput } from "src/models/courseModel";
import courseService from "src/services/courseService";
import courseDataService from "src/services/courseDataService";

class CoursesController {
  async createCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { icon, image } = req.files;
      const { title, subtitle, description } = req.body;
      if (!icon || !image) {
        throw ApiError.BadRequest("Изображения не найдены");
      }
      const Course = await courseService.createCourse({
        title,
        subtitle,
        description,
        image: "images/" + image[0].filename,
        icon: "images/" + icon[0].filename,
      });
      res.json(Course);
    } catch (e) {
      next(e);
    }
  }
  async updateCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { course } = req.params;
      const { icon, image } = req.files;
      const { title, subtitle, description } = req.body;
      const courseData: CourseInput = { title, subtitle, description };
      if (icon) {
        courseData.icon = "images/" + icon[0].filename;
      }
      if (image) {
        courseData.image = "images/" + image[0].filename;
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

  async getProgressCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const Courses = await courseDataService.getCoursesByRoles(req.user);
      res.json(Courses);
    } catch (e) {
      next(e);
    }
  }
  async getCourseModules(req: Request, res: Response, next: NextFunction) {
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
  async getCourseStudents(req: Request, res: Response, next: NextFunction) {
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
