import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import ApiError from "../exceptions/ApiError";
import { CourseInput } from "../models/course.model";
import courseDataService from "../services/courseAccess.service";
import courseService from "../services/course.service";
import courseProgressService from "../services/courseProgress.service";
import courseMastersService from "../services/courseMasters.service";
import { CreateCourseReq, UpdateCourseReq } from "../schemas/course.schema";

class CoursesController {
  async createCourse(
    req: Request<{}, {}, CreateCourseReq["body"]>,
    res: Response,
    next: NextFunction
  ) {
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
  async updateCourse(
    req: Request<UpdateCourseReq["params"], {}, UpdateCourseReq["body"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.files || Array.isArray(req.files)) {
        return next(ApiError.BadRequest("Изображения не найдены"));
      }
      const image = req.files["image"];
      const icon = req.files["icon"];
      const { course } = req.params;
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
  async getStudentProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { course, user } = req.params;
      const Profile = await courseDataService.getCourseStudentProfileByRoles(
        course,
        user,
        req.user
      );
      res.json(Profile);
    } catch (e) {
      next(e);
    }
  }
  async createStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const { course, user } = req.params;
      const { format } = req.body;
      if (!user || !course || !format) {
        next(ApiError.BadRequest("Недостаточно данных"));
      }
      const Student = await courseProgressService.createCourseProgress(
        user,
        course,
        format
      );
      res.json(Student);
    } catch (e) {
      next(e);
    }
  }
  async updateStudentAccess(req: Request, res: Response, next: NextFunction) {
    try {
      const { course, user } = req.params;
      const { isAvailable } = req.body;
      const Progress = await courseProgressService.updateCourseProgressAccess(
        user,
        course,
        isAvailable
      );
      res.json(Progress);
    } catch (e) {
      next(e);
    }
  }
  async createMaster(req: Request, res: Response, next: NextFunction) {
    try {
      const { course, user } = req.params;
      if (!user || !course) {
        next(ApiError.BadRequest("Недостаточно данных"));
      }
      const Master = await courseMastersService.createCourseMaster(
        user,
        course
      );
      res.json(Master);
    } catch (e) {
      next(e);
    }
  }
  async updateMasterAccess(req: Request, res: Response, next: NextFunction) {
    try {
      const { course, user } = req.params;
      const { isAvailable } = req.body;
      const Progress = await courseMastersService.updateCourseMasterAccess(
        user,
        course,
        isAvailable
      );
      res.json(Progress);
    } catch (e) {
      next(e);
    }
  }
}

export default new CoursesController();
